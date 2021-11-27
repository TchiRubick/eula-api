import { Request, Response, Router } from 'express';
import { validate, Joi } from 'express-validation';

import privateCheckMiddleware from '~/middlewares/privateCheckMiddleware';
import * as saleRepository from '~/services/sales/sale.repository';
import { getOne, oscillatorQuantity } from '~/services/inventories/inventory.repository';
import { transformCreationToDb } from '~/services/sales/sale.transformer';

const router = Router();

const createValidation = {
  body: Joi.array().items({
    inventory: Joi.string().required(),
    prices: Joi.number().required(),
    quantity: Joi.number().min(1).required(),
  }),
};

router.put('/', privateCheckMiddleware, validate(createValidation), async (req: Request, res: Response) => {
  const sessionTransaction = await saleRepository.session();

  const lastTicket = await saleRepository.getLastTicket();

  sessionTransaction.startTransaction();

  // eslint-disable-next-line no-restricted-syntax
  for await (const i of req.body) {
    const inventory = await getOne({
      barcode: i.inventory,
      quantity: { $gt: 0 },
    });

    if (inventory instanceof Error) {
      sessionTransaction.abortTransaction();
      return res.status(422).json({ error: inventory.message, message: 'Error while creating ticket on get' });
    }

    const { _id: idInventory, quantity: qttInv, name } = inventory;
    const { _id: idUser } = req.user;

    if (qttInv < i.quantity) {
      sessionTransaction.abortTransaction();
      return res.status(422).json({ error: `Not enough sold ${name}`, message: 'Error while creating ticket on get' });
    }

    const decrementInv = await oscillatorQuantity({ _id: idInventory }, (i.quantity * -1));

    if (decrementInv instanceof Error) {
      sessionTransaction.abortTransaction();
      return res.status(422).json({ error: decrementInv.message, message: 'Error while creating ticket on dec' });
    }

    const ticket = lastTicket + 1;
    const transformedSale = transformCreationToDb(i, ticket, idUser, idInventory);

    const createSale = await saleRepository.create(transformedSale);

    if (createSale instanceof Error) {
      sessionTransaction.abortTransaction();
      return res.status(422).json({ error: createSale.message, message: 'Error while creating ticket on cre' });
    }
  }

  sessionTransaction.commitTransaction();

  return res.json({ });
});

export default router;

import { Request, Response, Router } from 'express';
import { validate, Joi } from 'express-validation';
import { format, parseISO } from 'date-fns';

import privateCheckMiddleware from '~/middlewares/privateCheckMiddleware';
import * as saleRepository from '~/services/sales/sale.repository';
import { getOne, oscillatorQuantity } from '~/services/inventories/inventory.repository';
import { getPaginationStats } from '~/services/pagination/pagination.service';
import { transformManySampleUserToPrivate, transformToPrivate } from '~/services/sales/sale.transformer';
import { isISampleOutputSale } from '~/services/sales/sale.interface';

const router = Router();

const createValidation = {
  body: Joi.object({
    inventories: Joi.array().items({
      barcode: Joi.string().required(),
      price: Joi.number().required(),
      quantity: Joi.number().min(1).required(),
    }),
    payed: Joi.number().required().min(1),
    backed: Joi.number().required().min(0),
  }),
};

router.post('/', privateCheckMiddleware, validate(createValidation), async (req: Request, res: Response) => {
  const sessionTransaction = await saleRepository.session();
  const { _id: idUser } = req.user;

  const lastTicket = await saleRepository.getLastTicket({});

  let ticket = 0;

  if (isISampleOutputSale(lastTicket)) {
    ticket = lastTicket.ticket + 1;
  }

  sessionTransaction.startTransaction();

  const inventories = [];

  // eslint-disable-next-line no-restricted-syntax
  for await (const i of req.body.inventories) {
    const inventory = await getOne({
      barcode: i.barcode,
      quantity: { $gt: 0 },
    });

    if (inventory instanceof Error) {
      await sessionTransaction.abortTransaction();
      return res.status(422).json({ error: inventory.message, message: 'Error while verifying inventory' });
    }

    const {
      _id: idInventory,
      quantity: qttInventory,
      price: priceInventory,
      name,
    } = inventory;

    if (qttInventory < i.quantity) {
      await sessionTransaction.abortTransaction();
      return res.status(422).json({ error: `Not enough sold ${name}`, message: `Not enough sold ${name}` });
    }

    const decrementInv = await oscillatorQuantity({ _id: idInventory }, (i.quantity * -1));

    if (decrementInv instanceof Error) {
      await sessionTransaction.abortTransaction();
      return res.status(422).json({ error: decrementInv.message, message: 'Error while updating quantity' });
    }

    inventories.push({
      inventory: idInventory,
      price: priceInventory,
      quantity: i.quantity,
    });
  }

  const transformedSale = {
    inventories,
    user: idUser,
    ticket,
    status: 'saled',
    payed: req.body.payed,
    backed: req.body.backed,
  };

  const createSale = await saleRepository.create(transformedSale);

  if (createSale instanceof Error) {
    await sessionTransaction.abortTransaction();
    return res.status(422).json({ error: createSale.message, message: 'Error while creating ticket' });
  }

  await sessionTransaction.commitTransaction();

  return res.json({ ticket });
});

const filterValidation = {
  query: Joi.object({
    date: Joi.string(),
    page: Joi.number(),
    size: Joi.number().max(60),
  }),
};

type requestFilter = {
  date?: string
  page?: string
  size?: string
};

router.get('/', privateCheckMiddleware, validate(filterValidation), async (req: Request, res: Response) => {
  const { date: qDate, page: qPage, size: qSize }: requestFilter = req.query;

  const page = qPage ? parseInt(qPage, 10) : 0;
  const size = qSize ? parseInt(qSize, 10) : 0;
  const date = qDate ? new Date(qDate) : new Date();

  const formattedDate = parseISO(format(date, 'yyyy-MM-dd'));

  const sales = await saleRepository.getByDate(formattedDate, page, size);

  if (sales instanceof Error) {
    return res.status(422).json({ error: sales.message, message: 'Cannot get list of sales' });
  }

  const count = await saleRepository.getCount();

  const stats = getPaginationStats(page, size, count);

  const resume = await saleRepository.getTotalByDateSaled(date);

  const salesResponse = transformManySampleUserToPrivate(sales);

  return res.json({ sales: salesResponse, stats, resume });
});

router.get('/last-ticket', privateCheckMiddleware, async (req: Request, res: Response) => {
  const { _id: userId } = req.user;

  const sale = await saleRepository.getLastTicket({ user: userId });

  if (sale instanceof Error) {
    return res.status(422).json({ error: sale.message, message: 'Cannot cancel ticket' });
  }

  return res.json({ sale });
});

const detailsValidation = {
  params: Joi.object({
    ticket: Joi.number().required(),
  }),
};

router.get('/:ticket', privateCheckMiddleware, validate(detailsValidation), async (req: Request, res: Response) => {
  const { ticket } = req.params;

  const sale = await saleRepository.getOne({ ticket });

  if (sale instanceof Error) {
    return res.status(422).json({ error: sale.message, message: 'Cannot get sale' });
  }

  return res.json({ users: transformToPrivate(sale) });
});

router.patch('/', privateCheckMiddleware, async (req: Request, res: Response) => {
  const { _id: userId } = req.user;

  const sale = await saleRepository.getLastTicket({ user: userId });

  if (sale instanceof Error) {
    return res.status(422).json({ error: sale.message, message: 'Cannot cancel ticket' });
  }

  if (sale.status !== 'saled') {
    return res.status(422).json({ error: true, message: 'Last ticket cannot be canceled' });
  }

  const sessionTransaction = await saleRepository.session();

  sessionTransaction.startTransaction();

  // eslint-disable-next-line no-restricted-syntax
  for await (const inv of sale.inventories) {
    const { inventory, quantity } = inv;

    const updateInventory = await oscillatorQuantity({ _id: inventory }, quantity);

    if (updateInventory instanceof Error) {
      await sessionTransaction.abortTransaction();
      return res.status(422).json({ error: updateInventory.message, message: 'Cannot cancel ticket inventory' });
    }
  }

  const { _id: idSale } = sale;

  const updateSale = await saleRepository.update({ _id: idSale }, { status: 'refund' });

  if (updateSale instanceof Error) {
    await sessionTransaction.abortTransaction();
    return res.status(422).json({ error: 'Cannot refund ticket', message: 'Cannot cancel ticket' });
  }

  await sessionTransaction.commitTransaction();

  return res.json({ sale: updateSale });
});

export default router;

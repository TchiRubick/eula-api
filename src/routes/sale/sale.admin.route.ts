import { Request, Response, Router } from 'express';
import adminCheckMiddleware from '~/middlewares/adminCheckMiddleware';

import * as saleRepository from '~/services/sales/sale.repository';
import { oscillatorQuantity } from '~/services/inventories/inventory.repository';

const router = Router();

router.patch('/', adminCheckMiddleware, async (req: Request, res: Response) => {
  const lastTicket = await saleRepository.getLastTicket();

  const sales = await saleRepository.get({ ticket: lastTicket, status: 'saled' });

  if (sales instanceof Error) {
    return res.status(422).json({ error: sales.message, message: 'Cannot cancel ticket' });
  }

  const sessionTransaction = await saleRepository.session();

  sessionTransaction.startTransaction();

  // eslint-disable-next-line no-restricted-syntax
  for await (const sale of sales) {
    const updateInventory = await oscillatorQuantity({ _id: sale.inventory }, sale.quantity);

    if (updateInventory instanceof Error) {
      sessionTransaction.abortTransaction();
      return res.status(422).json({ error: updateInventory.message, message: 'Cannot cancel ticket inventory' });
    }

    const { _id: idSale } = sale;

    const updateSale = await saleRepository.update({ _id: idSale }, { status: 'refund' });

    if (updateSale instanceof Error) {
      sessionTransaction.abortTransaction();
      return res.status(422).json({ error: 'Cannot refund ticket', message: 'Cannot cancel ticket' });
    }
  }

  sessionTransaction.commitTransaction();

  return res.json({ sales });
});

export default router;
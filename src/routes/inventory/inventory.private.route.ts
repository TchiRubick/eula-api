import { Request, Response, Router } from 'express';
import { validate, Joi } from 'express-validation';

import privateCheckMiddleware from '~/middlewares/privateCheckMiddleware';
import * as inventoryRepository from '~/services/inventories/inventory.repository';
import { transformToAdmin, transformManyToAdmin } from '~/services/inventories/inventory.transformer';
import * as iI from '~/services/inventories/inventory.interface';
import { getPaginationStats } from '~/services/pagination/pagination.service';

const router = Router();

const createValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    barcode: Joi.string().alphanum().min(10).max(15)
      .required(),
    price: Joi.number().required(),
    cost: Joi.number().required(),
    quantity: Joi.number().required(),
  }),
};

router.post('/', privateCheckMiddleware, validate(createValidation, {}, {}), async (req: Request, res: Response) => {
  const inventory = await inventoryRepository.create(req.body);

  if (inventory instanceof Error) {
    return res.status(409).json({ error: inventory.message, message: 'Cannot create the inventory' });
  }

  return res.json({ inventory: transformToAdmin(inventory) });
});

const updateValidation = {
  body: Joi.object({
    name: Joi.string(),
    barcode: Joi.string().alphanum().min(10).max(15),
    price: Joi.number().greater(0),
    cost: Joi.number().greater(0),
    quantity: Joi.number().greater(0),
  }),
  params: Joi.object({
    barcode: Joi.string().alphanum().min(10).max(15)
      .required(),
  }),
};

router.put('/:barcode',
  privateCheckMiddleware,
  validate(updateValidation, {}, {}),
  async (req: Request, res: Response) => {
    const { barcode: currentBarcode } = req.params;

    const inventory = await inventoryRepository.getOne({ barcode: currentBarcode });

    if (inventory instanceof Error) {
      return res.status(422).json({ error: inventory.message, message: 'Inventory does not exist' });
    }

    const {
      name,
      barcode,
      price,
      cost,
      quantity,
    } = req.body;

    const dataUpdate: iI.iReqUpdateInv = {
      ...(name && inventory.name !== name ? { name } : {}),
      ...(barcode && inventory.barcode !== barcode ? { barcode } : {}),
      ...(price && inventory.price !== price ? { price } : {}),
      ...(cost && inventory.cost !== cost ? { cost } : {}),
      ...(quantity ? { quantity: inventory.quantity + quantity } : {}),
    };

    const inventoryUpdated = await inventoryRepository.updateOne({ barcode: currentBarcode }, dataUpdate);

    if (inventoryUpdated instanceof Error) {
      return res.status(409).json({ error: inventoryUpdated.message, message: 'Cannot update the inventory' });
    }

    return res.json({ inventory: transformToAdmin(inventoryUpdated) });
  });

const filterValidation = {
  query: Joi.object({
    search: Joi.string(),
    page: Joi.number(),
    size: Joi.number().max(60),
  }),
};

type requestFilter = {
  search?: string
  page?: string
  size?: string
};

router.get('/', privateCheckMiddleware, validate(filterValidation, {}, {}), async (req: Request, res: Response) => {
  const { search, page: qPage, size: qSize }: requestFilter = req.query;

  const page = qPage ? parseInt(qPage, 10) : 0;
  const size = qSize ? parseInt(qSize, 10) : 0;

  const inventories = await inventoryRepository.getByFilter(search, page, size);

  if (inventories instanceof Error) {
    return res.status(422).json({ error: inventories.message, message: 'Cannot get list of inventories' });
  }

  const count = await inventoryRepository.getCount();

  return res.json({ users: transformManyToAdmin(inventories), stats: getPaginationStats(page, size, count) });
});

const detailsValidation = {
  params: Joi.object({
    barcode: Joi.string().alphanum().min(10).max(15),
  }),
};

router.get('/:barcode',
  privateCheckMiddleware,
  validate(detailsValidation, {}, {}),
  async (req: Request, res: Response) => {
    const { barcode } = req.params;

    const inventory = await inventoryRepository.getOne({ barcode });

    if (inventory instanceof Error) {
      return res.status(422).json({ error: inventory.message, message: 'Cannot get inventory' });
    }

    return res.json({ users: transformToAdmin(inventory) });
  });

export default router;

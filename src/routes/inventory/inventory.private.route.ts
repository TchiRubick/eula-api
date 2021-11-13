import { Request, Response, Router } from 'express';
import { validate, Joi } from 'express-validation';

import privateCheckMiddleware from '~/middlewares/privateCheckMiddleware';
import * as inventoryRepository from '~/services/inventories/inventory.repository';
import { transformToAdmin } from '~/services/inventories/inventory.transformer';

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
    return res.status(401).json({ ...inventory, error: 'Cannot create the inventory' });
  }

  return res.json({ inventory: transformToAdmin(inventory) });
});

export default router;

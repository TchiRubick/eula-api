import { Request, Response, Router } from 'express';
import { validate, Joi } from 'express-validation';
import adminCheckMiddleware from '~/middlewares/adminCheckMiddleware';
import { transformToAdmin, transformManyToAdmin } from '~/services/user/user.transformer';
import * as userRepository from '~/services/user/user.repository';
import { getPaginationStats } from '~/services/pagination/pagination.service';

const router = Router();

const createValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
    name: Joi.string().alphanum().min(3).max(30)
      .required(),
    role: Joi.string().valid('user', 'admin'),
  }),
};

router.post('/', adminCheckMiddleware, validate(createValidation, {}, {}), async (req: Request, res: Response) => {
  const user = await userRepository.create(req.body);

  if (user instanceof Error) {
    return res.status(401).json({ ...user, error: 'Cannot create the user' });
  }

  return res.json({ user: transformToAdmin(user) });
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

router.get('/', adminCheckMiddleware, validate(filterValidation, {}, {}), async (req: Request, res: Response) => {
  const { search, page: qPage, size: qSize }: requestFilter = req.query;

  const page = qPage ? parseInt(qPage, 10) : 0;
  const size = qSize ? parseInt(qSize, 10) : 0;

  const users = await userRepository.getByFilter(search, page, size);

  if (users instanceof Error) {
    return res.status(401).json({ ...users, error: 'Cannot get list of users' });
  }

  const count = await userRepository.getCount();

  return res.json({ users: transformManyToAdmin(users), stats: getPaginationStats(page, size, count) });
});

export default router;

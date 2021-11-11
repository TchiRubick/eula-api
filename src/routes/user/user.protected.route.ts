import { Request, Response, Router } from 'express';
import { validate, Joi } from 'express-validation';
import { transformToPublic } from '~/services/user/user.transformer';
import { create } from '~/services/user/user.repository';
import protectedCheckMiddleware from '~/middlewares/protectedCheckMiddleware';

const router = Router();

const loginValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
    name: Joi.string().alphanum().min(3).max(30)
      .required(),
    role: Joi.string().valid('user', 'admin'),
  }),
};

router.post('/', protectedCheckMiddleware, validate(loginValidation, {}, {}), async (req: Request, res: Response) => {
  const user = await create(req.body);

  if (user instanceof Error) {
    return res.status(401).json({ ...user, error: 'Cannot create the user' });
  }

  return res.json({ user: transformToPublic(user) });
});

export default router;

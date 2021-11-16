import { Request, Response, Router } from 'express';
import { validate, Joi } from 'express-validation';

import privateCheckMiddleware from '~/middlewares/privateCheckMiddleware';
import { updateOne } from '~/services/user/user.repository';
import { transformToPublic } from '~/services/user/user.transformer';
import { setCrypto } from '~/utils/crypter/crypter.utils';

const router = Router();

const changeValidation = {
  body: Joi.object({
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
  }),
};

router.put('/new-password', privateCheckMiddleware, validate(changeValidation), async (req: Request, res: Response) => {
  const { password } = req.body;
  const { _id: id } = req.user;

  const user = await updateOne({ _id: id }, { password: await setCrypto(password) });

  if (user instanceof Error) {
    return res.status(422).json({ error: user.message, message: 'user not updated' });
  }

  return res.json({ user: transformToPublic(user) });
});

export default router;

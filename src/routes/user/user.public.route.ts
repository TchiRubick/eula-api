import { Request, Response, Router } from 'express';
import { validate, Joi } from 'express-validation';
import { transformToPublic } from '~/services/user/user.transformer';
import { getOne, create } from '~/services/user/user.repository';
import { compareCrypto } from '~/utils/crypter/crypter.utils';
import { setToken } from '~/utils/jwt/jwt.utils';
import { config } from '~/config/index.config';

const router = Router();

const loginValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
  }),
};

router.post('/', validate(loginValidation), async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await getOne({ email });

  if (user instanceof Error) {
    return res.status(422).json({ error: user.message, message: 'user not found' });
  }

  if (user.role === 'removed') {
    return res.status(422).json({ error: '', message: 'User is no more active' });
  }

  const validePassword = await compareCrypto(password, user.password);

  if (!validePassword) {
    return res.status(403).json({ error: 'Credentials doesn\'t match', message: 'user not found' });
  }

  const publicUser = transformToPublic(user);

  return res.json({ user: publicUser, token: setToken(publicUser) });
});

const createValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

router.post('/create/admin', validate(createValidation), async (req: Request, res: Response) => {
  const { email } = req.body;

  const password = config.adminDefaultPassword;

  const name = email.split('@')[0];

  const input = {
    email,
    password,
    name,
    role: 'admin',
  };

  const user = await create(input);

  if (user instanceof Error) {
    return res.status(409).json({ error: user.message, message: 'Cannot create the user admin' });
  }

  return res.json({ user: transformToPublic(user) });
});

export default router;

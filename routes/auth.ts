import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const router = Router();

const jwtSecret = 'rsclone 2020 2021 lsvdrmak';

// /api/auth/register
router.post(
  '/register',
  [
    check('login', 'Minimum login length should be 4').isLength({ min: 4 }),
    check('password', 'Minimum password length should be 6').isLength({ min: 6 }),
  ],
  async (req: any, res: any) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Bad input data',
        });
      }

      const { login, password } = req.body;

      const candidate = await User.findOne({ login });

      if (candidate) {
        return res.status(400).json({ message: 'This email is used for another user!' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user: any = new User({ login, password: hashedPassword });

      await user.save();

      res.status(201).json({ message: 'User created successful!' });
    } catch (e) {
      console.log(e.message);

      res.status(500).json({ message: 'Error!!!' });
    }
  },
);

// /api/auth/login
router.post(
  '/login',
  [
    check('login', 'Minimum login length should be 4').exists().isLength({ min: 4 }),
    check('password', 'Minimum password length shold be 6').exists().isLength({ min: 6 }),
  ],
  async (req: any, res: any) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Bad input data',
        });
      }

      const { login, password } = req.body;

      const user: any = await User.findOne({ login });

      if (!user) {
        return res.status(400).json({ message: 'User not found!' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Bad password' });
      }

      const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });

      res.json({ token, userId: user.id });
    } catch (e) {
      res.status(500).json({ message: 'Error!!!' });
    }
  },
);

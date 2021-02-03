import { Router } from 'express';
import User from '../models/User';
import Game from '../models/Game';

export const router = Router();

// /api/user/:id
router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const userInfo: any = await User.findOne({ _id: id });

    if (!userInfo) {
      return res.status(400).json({ message: 'Failed to load user info!' });
    }

    if (id !== userInfo.id) {
      return res.status(400).json({ message: 'This is not your login!' });
    }

    res.json({
      login: userInfo.login,
      score: userInfo.score,
    });
  } catch (e) {
    console.log(e.message);

    res.status(500).json({ message: 'Error!!!' });
  }
});

// /api/user/:id/games
router.get('/:id/games', [], async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const userInfo: any = await User.findOne({ _id: id });

    if (!userInfo) {
      return res.status(400).json({ message: 'Failed to load user info!' });
    }

    const games = await Game.find({ userId: userInfo.id });

    if (!games) {
      return res.status(400).json({ message: 'Games not found!' });
    }

    const user = {
      login: userInfo.login,
      userId: userInfo.userId,
      score: userInfo.score,
      games,
    };

    res.json(user);
  } catch (e) {
    console.log(e.message);

    res.status(500).json({ message: 'Error!!!' });
  }
});

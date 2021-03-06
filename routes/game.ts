import { Router } from 'express';
import User from '../models/User';
import Game from '../models/Game';

export const router = Router();

// /api/game/
router.get('/', [], async (req: any, res: any) => {
  try {
    const games: any = await Game.find({});

    if (!games) {
      return res.status(400).json({ message: 'Failed to load games!' });
    }

    res.json(games);
  } catch (e) {
    console.log(e.message);

    res.status(500).json({ message: 'Error!!!' });
  }
});

// /api/game/
router.get('/:id', [], async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const game: any = await Game.findOne({ _id: id });

    if (!game) {
      return res.status(400).json({ message: 'Failed to load game!' });
    }

    res.json(game);
  } catch (e) {
    console.log(e.message);

    res.status(500).json({ message: 'Error!!!' });
  }
});

// /api/game/
router.post('/', [], async (req: any, res: any) => {
  try {
    const { userId, isBot, fieldSize, score, time, isWin } = req.body;

    const user: any = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(400).json({ message: 'Failed to load user info!' });
    }

    const game = new Game({ userId, isBot, fieldSize, score, time, isWin, login: user.login });

    await game.save();

    user.score = +user.score + +score;

    await user.save();

    res.json({ userId, isBot, fieldSize, score, time });
  } catch (e) {
    console.log(e.message);

    res.status(500).json({ message: 'Error!!!' });
  }
});

// /api/game/top/:num
router.get('/top/:num', [], async (req: any, res: any) => {
  try {
    const { num } = req.params;
    const games: any = await Game.find({});

    if (!games) {
      return res.status(400).json({ message: 'Failed to load games!' });
    }

    const rating: any = {};

    games
      .sort((a: any, b: any) => b.score - a.score)
      .reduce((acc: any, game: any) => {
        if (!rating[game.fieldSize]) {
          rating[game.fieldSize] = [];
        }

        if (rating[game.fieldSize].length < num) {
          rating[game.fieldSize].push({
            id: rating[game.fieldSize].length + 1,
            name: game.login,
            score: game.score,
            time: game.time,
          });
        }
      }, {});

    res.json(rating);
  } catch (e) {
    console.log(e.message);

    res.status(500).json({ message: 'Error!!!' });
  }
});

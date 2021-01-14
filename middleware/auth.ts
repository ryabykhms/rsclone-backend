import jwt from 'jsonwebtoken';
import config from 'config';

export const auth = (req: any, res: any, next: any) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authorization failed!' });
    }

    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Authorization failed!' });
  }
};

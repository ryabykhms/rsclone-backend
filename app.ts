import express, { json, Request, Response, urlencoded } from 'express';
import logger from 'morgan';
import cors from 'cors';

import { wordsRouter } from './routes';

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));

app.use('/api/words', wordsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.json({
    statusCode: 404,
  });
});

// error handler
app.use((err: Error, req: Request, res: Response) => {
  res.json({
    statusCode: 500,
    message: err.message,
  });
});

export default app;

import express, { Express, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import router from './routes';
import instanceMongoDB from './dbs/init.mongodb';
// import * as mongooseConnection from './dbs/init.mongodb.lv0'
// import instanceMongoDB from './dbs/init.mongodb'

const app: Express = express();

// ========== middlewares ==========
app.use(morgan('dev'));
// morgan("combined")
// morgan("common")
// morgan("short")
// morgan("tiny")
// morgan("dev")

app.use(helmet()); // Dùng để bảo vệ những thông tin riêng tư
app.use(compression()); // Dùng để giảm tải bộ nhớ khi response data, nó sẽ giảm được đi hơn 100 lần
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// =========== init db ==========
// mongooseConnection
// instanceMongoDB
// require('./dbs/init.mongodb')
instanceMongoDB;
// checkOverload()

// ========== init routes ==========
app.use(router);

// handling error
app.use((req, res, next) => {
  const error: any = new Error('Not found');
  error.status = 404;
  next(error);
});
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: error.stack,
    message: error.message || 'Internal Server Error',
  });
});

export default app;

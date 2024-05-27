import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan'
import compression from 'compression'
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

// =========== init db ==========
// mongooseConnection
// instanceMongoDB
require('./dbs/init.mongodb')
// checkOverload()

export default app
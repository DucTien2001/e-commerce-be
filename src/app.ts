import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan'
import compression from 'compression'

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

export default app
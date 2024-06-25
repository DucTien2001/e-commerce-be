import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';

interface IUser {
  userId: Types.ObjectId;
  email: string;
}

export interface MyRequest extends Request {
  user: IUser;
}

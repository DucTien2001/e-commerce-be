import { Types } from 'mongoose';

export type TKeyToken = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  publicKey: string;
  privateKey: string;
  refreshToken?: string;
  createdAt: NativeDate;
  updatedAt: NativeDate;
};

export type TCreateKeyToken = {
  userId: Types.ObjectId;
  publicKey: string;
  privateKey: string;
  refreshToken?: string;
};

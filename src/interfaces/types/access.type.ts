import { Document, Types } from 'mongoose';
import { TKeyToken } from './keyToken.type';

export type TShopSignUp = {
  name: string;
  email: string;
  password: string;
};

export type TShopLogin = {
  email: string;
  password: string;
  refreshToken: string | null;
};

export type TShopLogout = {
  keyStore: TKeyToken;
};

export type THandleRefreshTokenV2 = {
  keyStore: Document<unknown, {}, TKeyToken> & TKeyToken;
  user: {
    email: string;
    userId: Types.ObjectId;
  };
  refreshToken: string;
};

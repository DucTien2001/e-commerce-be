import { Types } from "mongoose";

export type TCreateKeyToken = {
  userId: Types.ObjectId;
  publicKey: string;
  privateKey: string;
  refreshToken?: string;
};

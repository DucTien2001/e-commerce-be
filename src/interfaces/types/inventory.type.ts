import { Types } from 'mongoose';

export type TCreateInventory = {
  productId: Types.ObjectId;
  shopId: Types.ObjectId | string;
  stock: number;
  location?: string;
};

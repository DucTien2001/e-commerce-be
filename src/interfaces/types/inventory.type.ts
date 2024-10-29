import { Types } from "mongoose";

export type TCreateInventory = {
  productId: Types.ObjectId;
  shopId: Types.ObjectId | string;
  stock: number;
  location?: string;
};

export type TReserveInventory = {
  productId: string;
  cardId: string;
  quantity: number;
};

export type TAddStockToInventory = {
  stock: number;
  productId: string;
  shopId: string;
  location: string;
};

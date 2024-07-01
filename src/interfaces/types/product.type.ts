import { Types } from 'mongoose';

export type TFindAllProductsForShop = {
  shop: Types.ObjectId;
  limit?: number;
  skip?: number;
};

export type TPublishProductByShop = {
  shop: Types.ObjectId;
  id: Types.ObjectId;
};

export type TUnPublishProductByShop = {
  shop: Types.ObjectId;
  id: Types.ObjectId;
};

export type TFindProduct = {
  productId: Types.ObjectId;
  unSelect?: string[];
};

export type TUpdateProduct = {
  productId: Types.ObjectId;
  payload: any;
  model: any;
  isNew?: boolean;
};

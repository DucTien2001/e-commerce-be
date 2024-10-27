import { TProduct } from "./product.type";

export type TAddToCard = {
  userId: string;
  product: TProduct;
};

export type TAddToCardV2 = {
  userId: string;
  orderIds: {
    shopId: string;
    products: (TProduct & {
      productId: string;
      oldQuantity: number;
    })[];
    version: number;
  }[];
};

export type TCreateUserCard = {
  userId: string;
  product: TProduct;
};

export type TUpdateUserCardQuantity = {
  userId: string;
  product: Partial<TProduct>;
};

export type TDeleteUserCard = {
  userId: string;
  productId: string;
};

export type TGetListUserCard = {
  userId: string;
};

type TShopOrderItem = {
  shopId: string;
  shopDiscount: {
    shopId: string;
    discountId: string;
    code: string;
  }[];
  products: {
    price: number;
    quantity: number;
    productId: string;
  }[];
};

export type TCheckoutReview = {
  cardId: string;
  userId: string;
  shopOrders: TShopOrderItem[];
};

export type TOrderByUser = {
  cardId: string;
  userId: string;
  shopOrders: TShopOrderItem[];
  userAddress: any
  userPayment: any
};

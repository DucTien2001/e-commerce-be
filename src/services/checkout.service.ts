import { BadRequestError } from "../core/error.response";
import { TCheckoutReview, TOrderByUser, TProduct } from "../interfaces";
import orderModel from "../models/order.model";
import { findCardById } from "../repositories/card.repo";
import { checkProductByServer } from "../repositories/product.repo";
import CardService from "./card.service";
import DiscountService from "./discount.service";
import { acquireLock, releaseLock } from "./redis.service";

class CheckoutService {
  /*
        {
            cardId,
            userId,
            shopOrders: [
                {
                    shopId,
                    shopDiscount: [],
                    products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]
                },
                {
                    shopId,
                    shopDiscount: [
                        {
                            shopId,
                            discountId,
                            code
                        }
                    ],
                    products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]
                }
            ]
        }
    */
  static async checkoutReview({ cardId, userId, shopOrders }: TCheckoutReview) {
    // Check cardId có tồn tại hay không
    const foundCard = await findCardById(cardId);
    if (!foundCard) throw new BadRequestError("Card does not exist");

    const checkoutOrder = {
      totalPrice: 0, // Tong tien hang
      feeShip: 0, // Phi van chuyen
      totalDiscount: 0, // Tong tien discount
      totalCheckout: 0, // Tong thanh toan
    };
    const shopOrdersNew = [];

    // Tính tổng tiền bill
    const shopOrdersLength = shopOrders.length;
    for (let i = 0; i < shopOrdersLength; i++) {
      const { shopId, shopDiscount = [], products = [] } = shopOrders[i];
      // check product avalable
      const checkProductServer = await checkProductByServer(products);
      if (checkProductServer.includes(undefined))
        throw new BadRequestError("Order wrong!");

      // Tong tien don hang
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + (product?.quantity || 0) * (product?.price || 0);
      }, 0);

      // Tong tien truoc khi xu ly
      const itemCheckout = {
        shopId,
        shopDiscount,
        priceRaw: checkoutPrice, // chua apply discount
        priceApplyDiscount: checkoutPrice,
        product: checkProductServer,
      };

      // neu shopDiscount ton tai > 0, check xem co hop le hay khong
      if (shopDiscount.length > 0) {
        // Gia su chi co 1 discount
        // get amount discount
        const { totalPrice, discount } =
          await DiscountService.getDiscountAmount({
            code: shopDiscount[0].code,
            shopId: shopId,
            userId,
            products: checkProductServer as unknown as TProduct[],
          });

        // Tong cong discount
        checkoutOrder.totalDiscount = discount;
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }
      // Tong thanh toan cuoi cung
      checkoutOrder.totalCheckout = itemCheckout.priceApplyDiscount;
      shopOrdersNew.push(itemCheckout);
    }

    return {
      shopOrders,
      shopOrdersNew,
      checkoutOrder,
    };
  }

  // order
  static async orderByUser({
    shopOrders,
    cardId,
    userId,
    userAddress = {},
    userPayment = {},
  }: TOrderByUser) {
    const { shopOrdersNew, checkoutOrder } =
      await CheckoutService.checkoutReview({ cardId, userId, shopOrders });

    // Kiem tra xem co ton kho hay khong
    // get new array products
    const products = shopOrdersNew.flatMap((order) => order.product);

    const acquireProduct = [];
    const productsLength = products.length;
    for (let i = 0; i < productsLength; i++) {
      const { productId, quantity } = products[i] as unknown as {
        price: number;
        quantity: number;
        productId: string;
      };
      const keyLock = await acquireLock(productId, quantity, cardId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    // check if co mot san pham het hang trong kho
    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "Mot so san pham da duoc cap nhat. Vui long quay lai gio hang ..."
      );
    }

    const newOrder = await orderModel.create({
      userId: userId,
      checkout: checkoutOrder,
      shipping: userAddress,
      payment: userPayment,
      products: shopOrders,
    });

    // trường hợp nếu create thành công thì xóa product có trong cart
    if (newOrder) {
      // remove product in my cart
      await Promise.all(
        products.map((product) =>
          CardService.deleteUserCard({
            productId: product?.productId as unknown as string,
            userId,
          })
        )
      );
    }

    return newOrder;
  }

  // Query orders [Users]
  static async getOrdersByUser() {}

  // Query order using Id [Users]
  static async getOneOrderByUser() {}

  // Cancel order [Users]
  static async cancelOrderByUser() {}

  // Update order status [Shop | Admin]
  static async updateOrderStatus() {}
}

export default CheckoutService;

"use strict";

import { NotFoundError } from "../core/error.response";
import {
  ECardState,
  TAddToCard,
  TAddToCardV2,
  TDeleteUserCard,
  TGetListUserCard,
} from "../interfaces";
import cardModel from "../models/card.model";
import {
  createUserCard,
  updateUserCardQuantity,
} from "../repositories/card.repo";
import { getProductById } from "../repositories/product.repo";

/**
 * Key feature: Card service
 * 1. Add product to card [user]
 * 2. reduce product by quantity by one [user]
 * 3. increate product quantity by one [user]
 * 4. get card [user]
 * 5. delete card [user]
 * 6. delete card item [user]
 */

class CardService {
  // Add product to card
  static async addToCard({ userId, product }: TAddToCard) {
    // check user
    if (!userId) throw new NotFoundError("Not found user");

    // Check card co ton tai hay khong
    const userCard = await cardModel.findOne({ userId: userId });

    if (!userCard) {
      // create card for user
      return createUserCard({ userId, product });
    }

    // Nếu có giỏ hàng rồi như chưa có sp
    if (!userCard.products.length) {
      userCard.products = [product];

      return await userCard.save();
    }

    // giỏ hàng tồn tại và có sp này trong giỏ hàng thì update quantity
    return await updateUserCardQuantity({ userId, product });
  }

  //   update card
  /*
    userId,
    orderIds: [
        {
            shopId,
            products: [
                {
                    quantity,
                    price,
                    shopId,
                    oldQuantity,
                    productId
                }
            ],
            version
        }
    ]
 */
  static async addToCardV2({ userId, orderIds }: TAddToCardV2) {
    const { productId, quantity, oldQuantity } = orderIds[0].products[0];

    // check user
    if (!userId) throw new NotFoundError("Not found user");

    // check product
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError("Not found product");

    // compare
    if (foundProduct.shop?.toString() !== orderIds[0].shopId) {
      throw new NotFoundError("Product do not belong to the shop");
    }

    if (quantity === 0) {
      // delete
      return await CardService.deleteUserCard({ userId, productId });
    }

    return await updateUserCardQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - oldQuantity,
      },
    });
  }

  static async deleteUserCard({ userId, productId }: TDeleteUserCard) {
    const query = { userId: userId, state: ECardState.Active };
    const updateSet = {
      $pull: {
        products: {
          productId,
        },
      },
    };

    const deleteCard = await cardModel.updateOne(query, updateSet);

    return deleteCard;
  }

  static async getListUserCard({ userId }: TGetListUserCard) {
    return await cardModel
      .findOne({
        userId: userId,
      })
      .lean();
  }
}

export default CardService;

import {
  ECardState,
  TCreateUserCard,
  TUpdateUserCardQuantity,
} from "../interfaces";
import cardModel from "../models/card.model";

export const createUserCard = async ({ userId, product }: TCreateUserCard) => {
  const query = { userId: userId, state: ECardState.Active };
  const updateOrInsert = {
    $addToSet: {
      products: product,
    },
  };
  const options = { upsert: true, new: true };

  return await cardModel.findOneAndUpdate(query, updateOrInsert, options);
};

export const updateUserCardQuantity = async ({
  userId,
  product,
}: TUpdateUserCardQuantity) => {
  const { productId, quantity } = product;
  const query = {
    userId: userId,
    "products.productId": productId,
    state: ECardState.Active,
  };
  const updateSet = {
    $inc: {
      "products.$.quantity": quantity,
    },
  };
  const options = { upsert: true, new: true };

  return await cardModel.findOneAndUpdate(query, updateSet, options);
};

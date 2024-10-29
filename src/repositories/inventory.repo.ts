"use strict";

import { TCreateInventory, TReserveInventory } from "../interfaces";
import inventoryModel from "../models/inventory.model";
import { convertToObjectIdMongodb } from "../utils";

export const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknow",
}: TCreateInventory) => {
  return await inventoryModel.create({
    productId: productId,
    shopId: shopId,
    stock: stock,
    location: location,
  });
};

export const reserveInventory = async ({
  productId,
  cardId,
  quantity,
}: TReserveInventory) => {
  const query = {
    productId: convertToObjectIdMongodb(productId),
    stock: { $gte: quantity },
  };
  const updateSet = {
    $inc: {
      stock: -quantity,
    },
    $push: {
      reservations: {
        quantity,
        cardId,
        createOn: new Date(),
      },
    },
  };
  const options = { upsert: true, new: true };

  return await inventoryModel.updateOne(query, updateSet);
};

"use strict";

import { BadRequestError } from "../core/error.response";
import { TAddStockToInventory } from "../interfaces";
import inventoryModel from "../models/inventory.model";
import { getProductById } from "../repositories/product.repo";

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location,
  }: TAddStockToInventory) {
    const product = await getProductById(productId);
    if (!product) {
      throw new BadRequestError("The product does not exists");
    }

    const query = {
      shopId: shopId,
      productId: productId,
    };
    const updateSet = {
      $inc: {
        stock: stock,
      },
      $set: {
        location: location,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };

    return await inventoryModel.findOneAndUpdate(query, updateSet, options);
  }
}

export default InventoryService;

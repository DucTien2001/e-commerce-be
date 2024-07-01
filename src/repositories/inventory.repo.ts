'use strict';

import { TCreateInventory } from '../interfaces';
import inventoryModel from '../models/inventory.model';

export const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = 'unknow',
}: TCreateInventory) => {
  return await inventoryModel.create({
    productId: productId,
    shopId: shopId,
    stock: stock,
    location: location,
  });
};

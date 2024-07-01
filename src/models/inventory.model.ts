'use strict';

import { model, Schema } from 'mongoose'; // Erase if already required

// !dmbg

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

// Declare the Schema of the Mongo model
var inventorySchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    location: {
      type: String,
      default: 'unknow',
    },
    stock: {
      type: Number,
      require: true,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    reservations: { // sử dụng khi user add vào giỏ hàng
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

export default model(DOCUMENT_NAME, inventorySchema);

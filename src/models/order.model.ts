"use strict";

import { model, Schema } from "mongoose"; // Erase if already required
import { EOrderStatus } from "../interfaces";

// !dmbg

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

// Declare the Schema of the Mongo model
var orderSchema = new Schema(
  {
    userId: {
      type: Number,
      require: true,
    },
    /*
      checkout = {
        totalPrice,
        totalApplyDiscount,
        feeShip
      }
    */
    checkout: {
      type: Object,
      default: {},
    },
    /*
      shipping = {
        street, city, country, state
      }
    */
    shipping: {
      type: Object,
      default: {},
    },
    payment: {
      type: Object,
      default: {},
    },
    products: {
      type: Array,
      require: true,
    },
    trackingNumber: {
      type: String,
    },
    status: {
      type: Number,
      enum: [
        EOrderStatus.Pending,
        EOrderStatus.Confirmed,
        EOrderStatus.Shipping,
        EOrderStatus.Delivered,
        EOrderStatus.Cancel,
      ],
      default: EOrderStatus.Pending,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

export default model(DOCUMENT_NAME, orderSchema);

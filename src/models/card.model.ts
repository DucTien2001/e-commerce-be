"use strict";

import { model, Schema } from "mongoose"; // Erase if already required
import { ECardState } from "../interfaces";

// !dmbg

const DOCUMENT_NAME = "Card";
const COLLECTION_NAME = "Cards";

// Declare the Schema of the Mongo model
var cardSchema = new Schema(
  {
    state: {
      type: Number,
      require: true,
      enum: [
        ECardState.Active,
        ECardState.Completed,
        ECardState.Failed,
        ECardState.Pending,
      ],
      default: ECardState.Active,
    },
    /*
        products: [
            {
                productId,
                shopId,
                quantity,
                name,
                price    
            }
        ] 
     */
    products: {
      type: Array,
      require: true,
      default: [],
    },
    countProduct: {
      type: Number,
      default: 0,
    },
    userId: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

export default model(DOCUMENT_NAME, cardSchema);

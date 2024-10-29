"use strict";

import { model, Schema } from "mongoose"; // Erase if already required

// !dmbg

const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "Comments";

// Declare the Schema of the Mongo model
var commentSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    userId: {
      type: Number,
      default: 1,
    },
    content: {
      type: String,
      default: "text",
    },
    left: {
      type: Number,
      default: 0,
    },
    right: {
      type: Number,
      default: 0,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

export default model(DOCUMENT_NAME, commentSchema);

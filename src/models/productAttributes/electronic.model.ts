import { Schema, model } from 'mongoose';

const DOCUMENT_NAME = 'Electronic';
const COLLECTION_NAME = 'Electronics';

const electronicSchema = new Schema(
  {
    manufacturer: {
      type: String,
      require: true,
    },
    model: {
      type: String,
    },
    color: {
      type: String,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

export default model(DOCUMENT_NAME, electronicSchema);

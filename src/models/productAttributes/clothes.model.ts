import { Schema, model } from 'mongoose';

const DOCUMENT_NAME = 'Clothes';
const COLLECTION_NAME = 'Clothes';

const clothesSchema = new Schema(
  {
    brand: {
      type: String,
      require: true,
    },
    size: {
      type: String,
    },
    material: {
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

export default model(DOCUMENT_NAME, clothesSchema);

'use strict';

import { model, Schema } from 'mongoose';
import slugify from 'slugify';
import { EProductType } from '../interfaces/enums/product.enum';

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

// Declare the Schema of the Mongo model
var productSchema = new Schema(
  {
    name: {
      // quan jean cao cap
      type: String,
      require: true,
    },
    thumb: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
    slug: {
      // quan-jean-cao-cap
      type: String,
    },
    price: {
      type: Number,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    type: {
      type: Number,
      require: true,
      enum: [
        EProductType.Electronic,
        EProductType.Clothes,
        EProductType.Furniture,
      ],
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    attributes: {
      type: Schema.Types.Mixed,
      require: true,
    },
    // more
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be greater than 1.0'],
      max: [5, 'Rating must be less than 5.0'],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Create index for search
productSchema.index({ name: 'text', description: 'text' });

// Document middleware: runs before .save() and .create()
productSchema.pre('save', function (next) {
  this.slug = slugify(this.name || '', { lower: true });
  next();
});

export default model(DOCUMENT_NAME, productSchema);

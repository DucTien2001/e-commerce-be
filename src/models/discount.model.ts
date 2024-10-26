'use strict';

import { model, Schema } from 'mongoose'; // Erase if already required
import { EDiscountAppliesTo, EDiscountType } from '../interfaces';

// !dmbg

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

// Declare the Schema of the Mongo model
var discountSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      default: EDiscountType.Money, // or percentage
      enum: [EDiscountType.Money, EDiscountType.Percent],
    },
    value: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    maxUses: {
      // So luong toi da discount duoc ap dung
      type: Number,
      required: true,
    },
    usedCount: {
      // So discount da su dung
      type: Number,
      required: true,
    },
    usersUsed: {
      // Những user đã sử dụng
      type: Array,
      default: [],
    },
    maxUsesPerUser: {
      // So luong cho phep toi da moi user su dung
      type: Number,
      required: true,
    },
    minOrderValue: {
      //
      type: Number,
      required: true,
      default: 0,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    appliesTo: {
      type: Number,
      require: true,
      enum: [EDiscountAppliesTo.All, EDiscountAppliesTo.Specific],
      default: EDiscountAppliesTo.All,
    },
    productIds: {
      // Nhung san pham duoc ap dung
      type: Array,
      default: [],
    },
    permissions: {
      type: [String],
      required: true,
      enum: ['0000', '1111', '2222'],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
export default model(DOCUMENT_NAME, discountSchema);

"use strict";

import { model, Schema } from "mongoose"; // Erase if already required
import { NotiType } from "../constants";

// !dmbg

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

/*
    Các thành viên trong dự án sẽ thống nhất quy ước ra các mã CODE tương ứng với mỗi loại thông báo,
        vì có rất nhiều loại thông báo trong hệ thống
    Ví dụ:
        ORDER-001: đặt hàng thành công
        ORDER-002: đặt hàng thất bại
        PROMOTION-001: có khuyến mãi mới
        SHOP-001: có sản phẩm mới
*/

// Declare the Schema of the Mongo model
var notificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: [
        NotiType.Order_001,
        NotiType.Order_002,
        NotiType.Promotion_001,
        NotiType.Shop_001,
      ],
      require: true,
    },
    senderId: { type: Schema.Types.ObjectId, require: true },
    receiverId: { type: Number, require: true },
    content: { type: String, require: true },
    options: { type: Object, default: {} },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

export default model(DOCUMENT_NAME, notificationSchema);

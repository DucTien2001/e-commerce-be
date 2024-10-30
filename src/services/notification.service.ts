import { ENotiType, TPushNotiToSystem } from "../interfaces";
import notificationModel from "../models/notification.model";

class NotificationService {
  static async pushNotiToSystem({
    type = ENotiType.Order_001,
    receiverId = 1,
    senderId = 1,
    options = {},
  }: TPushNotiToSystem) {
    let content = "";

    switch (type) {
      case ENotiType.Order_001:
        content = "";
      case ENotiType.Order_002:
        content = "";
      case ENotiType.Promotion_001:
        content = "";
      case ENotiType.Shop_001:
        content = "";
    }

    const newNoti = await notificationModel.create({
      type: type,
      senderId: senderId,
      receiverId: receiverId,
      content: content,
      options: options,
    });

    return newNoti;
  }

  static async getListNotiByUser({ userId = 1, type = "ALL", isRead = 0 }) {
    const match: any = { receiverId: userId };

    if (type === "ALL") {
      match["type"] = type;
    }

    return await notificationModel.aggregate([
      { $match: match },
      {
        $project: {
          type: 1,
          senderId: 1,
          receiverId: 1,
          centent: 1,
          options: 1,
          createdAt: 1,
        },
      },
    ]);
  }
}

export default NotificationService;

import { NextFunction, Response } from "express";
import { SuccessResponse } from "../core/success.response";
import { MyRequest } from "../interfaces";
import NotificationService from "../services/notification.service";

class NotificationController {
  // Get list noti by user
  getListNotiByUser = async (
    req: MyRequest,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "Get list noti by user success",
      metadata: await NotificationService.getListNotiByUser({
        ...req.query,
      }),
    }).send(res);
  };
}

export default new NotificationController();

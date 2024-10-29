import { NextFunction, Response } from "express";
import { SuccessResponse } from "../core/success.response";
import { MyRequest } from "../interfaces";
import CheckoutService from "../services/checkout.service";

class CheckoutController {
  // checkout review
  checkoutReview = async (
    req: MyRequest,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "Checkout review success",
      metadata: await CheckoutService.checkoutReview({
        ...req.body,
      }),
    }).send(res);
  };
}

export default new CheckoutController();

import { NextFunction, Response } from "express";
import { SuccessResponse } from "../core/success.response";
import { MyRequest } from "../interfaces";
import CardService from "../services/card.service";

class CardController {
  // new
  addToCard = async (req: MyRequest, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Create new card success",
      metadata: await CardService.addToCard({
        ...req.body,
      }),
    }).send(res);
  };

  // update + -
  update = async (req: MyRequest, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Update card success",
      metadata: await CardService.addToCardV2({
        ...req.body,
      }),
    }).send(res);
  };

  // delete
  delete = async (req: MyRequest, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Delete card success",
      metadata: await CardService.deleteUserCard({
        ...req.body,
      }),
    }).send(res);
  };

  // Get list user card
  getListUserCard = async (
    req: MyRequest,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "Get list user card success",
      metadata: await CardService.getListUserCard({
        ...req.body,
      }),
    }).send(res);
  };
}

export default new CardController();

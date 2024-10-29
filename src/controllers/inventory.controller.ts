import { NextFunction, Response } from "express";
import { SuccessResponse } from "../core/success.response";
import { MyRequest } from "../interfaces";
import InventoryService from "../services/inventory.service";

class InventoryController {
  // Add Stock To Inventory
  addStockToInventory = async (
    req: MyRequest,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "Add Stock To Inventory Success",
      metadata: await InventoryService.addStockToInventory({
        ...req.body,
      }),
    }).send(res);
  };
}

export default new InventoryController();

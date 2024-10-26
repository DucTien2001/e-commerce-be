import { Response, NextFunction } from 'express';
import { SuccessResponse } from '../core/success.response';
import { MyRequest } from '../interfaces';
import DiscountService from '../services/discount.service';

class DiscountController {
  createDiscountCode = async (
    req: MyRequest,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: 'Successul Code Generation',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodesByShop = async (
    req: MyRequest,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: 'Successul Code Generation',
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId.toString(),
      }),
    }).send(res);
  };

  getAllDiscountCodesWithProduct = async (
    req: MyRequest,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: 'Successul Code Generation',
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query,
      } as any),
    }).send(res);
  };

  getDiscountAmount = async (
    req: MyRequest,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: 'Successul Code Generation',
      metadata: await DiscountService.getDiscountAmount({
        ...req.query,
      } as any),
    }).send(res);
  };
}

export default new DiscountController();

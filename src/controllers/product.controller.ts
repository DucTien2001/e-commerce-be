import { NextFunction, Response } from 'express';
import { SuccessResponse } from '../core/success.response';
import ProductService from '../services/product.service';
import { MyRequest } from '../interfaces';

class ProductController {
  createProduct = async (req: MyRequest, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Create new product success!',
      metadata: await ProductService.createProduct(req.body.type, {
        ...req.body,
        shop: req.user.userId,
      }),
    }).send(res);
  };
}

export default new ProductController();

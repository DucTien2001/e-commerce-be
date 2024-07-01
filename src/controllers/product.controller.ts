import { NextFunction, Response } from 'express';
import { SuccessResponse } from '../core/success.response';
import ProductService from '../services/product.service';
import { MyRequest, TFindPagination, TSearch } from '../interfaces';
import { Types } from 'mongoose';

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

  // update product
  updateProduct = async (req: MyRequest, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Update product success!',
      metadata: await ProductService.updateProduct(
        req.body.type,
        req.params.id,
        {
          ...req.body,
          shop: req.user.userId,
        }
      ),
    }).send(res);
  };

  publishProductByShop = async (
    req: MyRequest,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: 'Publish product success!',
      metadata: await ProductService.publishProductByShop({
        shop: req.user.userId,
        id: new Types.ObjectId(req.params.id),
      }),
    }).send(res);
  };

  unPublishProductByShop = async (
    req: MyRequest,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: 'Un publish product success!',
      metadata: await ProductService.unPublishProductByShop({
        shop: req.user.userId,
        id: new Types.ObjectId(req.params.id),
      }),
    }).send(res);
  };

  // QUERY
  getAllDraftsForShop = async (
    req: MyRequest,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: 'Get list draft success!',
      metadata: await ProductService.finAllDraftsForShop({
        shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (
    req: MyRequest,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: 'Get list publish success!',
      metadata: await ProductService.finAllPublishForShop({
        shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (
    req: MyRequest,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: 'Get list search product success!',
      metadata: await ProductService.searchProduct(req.params as TSearch),
    }).send(res);
  };

  findAllProducts = async (
    req: MyRequest,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: 'Get all products success!',
      metadata: await ProductService.findAllProducts(req.query as any),
    }).send(res);
  };

  findProduct = async (req: MyRequest, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: 'Get product success!',
      metadata: await ProductService.findProduct({
        productId: new Types.ObjectId(req.params.id),
      }),
    }).send(res);
  };
}

export default new ProductController();

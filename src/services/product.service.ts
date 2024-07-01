import { Types } from 'mongoose';
import { BadRequestError } from '../core/error.response';
import {
  EProductType,
  TFindAllProductsForShop,
  TFindPagination,
  TFindProduct,
  TPublishProductByShop,
  TUnPublishProductByShop,
} from '../interfaces';
import productModel from '../models/product.model';
import clothesModel from '../models/productAttributes/clothes.model';
import electronicModel from '../models/productAttributes/electronic.model';
import furnitureModel from '../models/productAttributes/furniture.model';
import {
  finAllDraftsForShop,
  finAllPublishForShop,
  findAllProducts,
  findProduct,
  publishProductByShop,
  searchProductByUser,
  unPublishProductByShop,
  updateProductById,
} from '../repositories/product.repo';
import { removeUndefinedObject, updateNestedObjectParser } from '../utils';
import { insertInventory } from '../repositories/inventory.repo';

// define Factory class to create product, using fatory and strategy pattern
class ProductService {
  static productRegistry: any = {}; // key - class

  static registerProductType(type: EProductType, classRef: any) {
    ProductService.productRegistry[type] = classRef;
  }

  static async createProduct(type: EProductType, payload: TProductConstructor) {
    const productClass = ProductService.productRegistry[type];

    if (!productClass)
      throw new BadRequestError(`Invalid Product Type ${type}`);

    return new productClass(payload).createProduct();
  }

  static async updateProduct(
    type: EProductType,
    productId: string,
    payload: TProductConstructor
  ) {
    const productClass = ProductService.productRegistry[type];
    console.log(payload, '=======payload====');

    if (!productClass)
      throw new BadRequestError(`Invalid Product Type ${type}`);

    return new productClass(payload).updateProduct(productId);
  }

  // query
  static async finAllDraftsForShop({
    shop,
    limit = 50,
    skip = 0,
  }: TFindAllProductsForShop) {
    const query = { shop, isDraft: true };
    return await finAllDraftsForShop({ query, limit, skip });
  }

  static async finAllPublishForShop({
    shop,
    limit = 50,
    skip = 0,
  }: TFindAllProductsForShop) {
    const query = { shop, isPublished: true };
    return await finAllPublishForShop({ query, limit, skip });
  }

  static async searchProduct({ keySearch }: { keySearch: string }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true },
  }: TFindPagination) {
    return await findAllProducts({
      limit,
      sort,
      filter,
      page,
      select: ['name', 'price', 'thumb'],
    });
  }

  static async findProduct({ productId }: TFindProduct) {
    return await findProduct({ productId, unSelect: ['__v'] });
  }

  // PUT
  static async publishProductByShop({ shop, id }: TPublishProductByShop) {
    return await publishProductByShop({ shop, id });
  }

  static async unPublishProductByShop({ shop, id }: TUnPublishProductByShop) {
    return await unPublishProductByShop({ shop, id });
  }
}

type TProductConstructor = {
  name: string;
  thumb: string;
  description: string;
  price: number;
  quantity: number;
  type: EProductType;
  shop: string;
  attributes: object;
};

// define base product class
class Product {
  name: string;
  thumb: string;
  description: string;
  price: number;
  quantity: number;
  type: EProductType;
  shop: string;
  attributes: object;
  constructor({
    name,
    thumb,
    description,
    price,
    quantity,
    type,
    shop,
    attributes,
  }: TProductConstructor) {
    this.name = name;
    this.thumb = thumb;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.type = type;
    this.shop = shop;
    this.attributes = attributes;
  }

  //   create new product
  async createProduct(id: Types.ObjectId) {
    const newProduct = await productModel.create({ ...this, _id: id });
    if (newProduct) {
      // add product stock in inventoru collection
      await insertInventory({
        productId: newProduct._id,
        shopId: this.shop,
        stock: this.quantity,
      });
    }

    return newProduct;
  }

  // update product
  async updateProduct(productId: string, payload: TProductConstructor) {
    return await updateProductById({
      productId: new Types.ObjectId(productId),
      payload,
      model: productModel,
    });
  }
}

// define sub-class for difference product type Clothes
class Clothes extends Product {
  attributes: any;
  async createProduct() {
    const newClothes = await clothesModel.create({
      ...this.attributes,
      shop: this.shop,
    });
    if (!newClothes) throw new BadRequestError('Create new clothing error');

    const newProduct = await super.createProduct(newClothes._id);
    if (!newProduct) throw new BadRequestError('Create new product error');

    return newProduct;
  }

  async updateProduct(productId: string) {
    // 1. remove attribute is null, underfine
    const objectParams = removeUndefinedObject(this);
    // 2. Check xem update o cho nao?
    if (objectParams.attributes) {
      // update child
      return await updateProductById({
        productId: new Types.ObjectId(productId),
        payload: updateNestedObjectParser(objectParams.attributes),
        model: clothesModel,
      });
    }

    // update parent
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

// define sub-class for difference product type Electronic
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronicModel.create({
      ...this.attributes,
      shop: this.shop,
    });
    if (!newElectronic)
      throw new BadRequestError('Create new electronic error');

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError('Create new product error');

    return newProduct;
  }

  async updateProduct(productId: string) {
    // 1. remove attribute is null, underfine
    const objectParams = removeUndefinedObject(this);
    console.log(objectParams, '===objectParams===');
    // 2. Check xem update o cho nao?
    if (objectParams.attributes) {
      // update child
      console.log(
        {
          productId: new Types.ObjectId(productId),
          payload: updateNestedObjectParser(objectParams.attributes),
          model: electronicModel,
        },
        '=== child ====='
      );
      return await updateProductById({
        productId: new Types.ObjectId(productId),
        payload: updateNestedObjectParser(objectParams.attributes),
        model: electronicModel,
      });
    }

    // update parent
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

// define sub-class for difference product type Furniture
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furnitureModel.create({
      ...this.attributes,
      shop: this.shop,
    });
    if (!newFurniture) throw new BadRequestError('Create new furniture error');

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError('Create new product error');

    return newProduct;
  }

  async updateProduct(productId: string) {
    // 1. remove attribute is null, underfine
    const objectParams = removeUndefinedObject(this);
    // 2. Check xem update o cho nao?
    if (objectParams.attributes) {
      // update child
      return await updateProductById({
        productId: new Types.ObjectId(productId),
        payload: updateNestedObjectParser(objectParams.attributes),
        model: furnitureModel,
      });
    }

    // update parent
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

// register product types
ProductService.registerProductType(EProductType.Electronic, Electronic);
ProductService.registerProductType(EProductType.Clothes, Clothes);
ProductService.registerProductType(EProductType.Furniture, Furniture);

export default ProductService;

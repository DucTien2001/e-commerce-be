import { Types } from 'mongoose';
import { BadRequestError } from '../core/error.response';
import { EProductType } from '../interfaces';
import productModel from '../models/product.model';
import clothesModel from '../models/productAttributes/clothes.model';
import electronicModel from '../models/productAttributes/electronic.model';
import furnitureModel from '../models/productAttributes/furniture.model';

// define Factory class to create product, using fatory and strategy pattern
class ProductService {
  static productRegistry: any = {}; // key - class

  static registerProductType(type: EProductType, classRef: any) {
    ProductService.productRegistry[type] = classRef;
  }

  static async createProduct(
    type: EProductType,
    payload: TProductConstructor
  ) {
    const productClass = ProductService.productRegistry[type];

    if (!productClass)
      throw new BadRequestError(`Invalid Product Type ${type}`);

    return new productClass(payload).createProduct();
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
    return productModel.create({ ...this, _id: id });
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
}

// register product types
ProductService.registerProductType(EProductType.Electronic, Electronic);
ProductService.registerProductType(EProductType.Clothes, Clothes);
ProductService.registerProductType(EProductType.Furniture, Furniture);

export default ProductService;

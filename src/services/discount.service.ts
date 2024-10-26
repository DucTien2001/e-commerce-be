'use strict';

import { BadRequestError, NotFoundError } from '../core/error.response';
import {
  EDiscountAppliesTo,
  EDiscountType,
  TCancelDiscountCode,
  TCreateDiscountCode,
  TDeleteDiscountCode,
  TGetAllDiscountCodesByShop,
  TGetAllDiscountCodesWithProduct,
  TGetDiscountAmount,
} from '../interfaces';
import discountModel from '../models/discount.model';
import {
  checkDiscountExists,
  findAllDiscountCodesUnSelect,
} from '../repositories/discount.repo';
import { findAllProducts } from '../repositories/product.repo';
import { convertToObjectIdMongodb } from '../utils';

/*
    Discount service
    1. Generator discount code [Shop | Admin]
    2. Get discount amount [User]
    3. Get all discount codes [User | Shop]
    4. Verify discount code [User]
    5. Delete discount code [Shop | Admin]
    6. Cancel discount code [User]
*/

class DiscountService {
  static async createDiscountCode(payload: TCreateDiscountCode) {
    const {
      code,
      startDate,
      endDate,
      shopId,
      isActive,
      value,
      minOrderValue = 0,
      productIds,
      appliesTo,
      name,
      description,
      type,
      maxValue,
      maxUses,
      usedCount,
      usersUsed,
      maxUsesPerUser,
    } = payload;
    //  Kiem tra
    if (new Date() < new Date(startDate) || new Date() > new Date(endDate)) {
      throw new BadRequestError('Discount code has expired');
    }

    if (new Date(startDate) >= new Date(endDate)) {
      throw new BadRequestError('Start date must be before end date');
    }

    // create index for discount
    const foundDiscount = await discountModel
      .findOne({
        code: code,
        shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.isActive) {
      throw new BadRequestError('Discount exists!');
    }

    const newDiscount = await discountModel.create({
      name,
      description,
      type,
      code,
      value,
      minOrderValue,
      maxValue,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      maxUses,
      usedCount,
      usersUsed,
      shopId,
      maxUsesPerUser,
      isActive,
      appliesTo,
      productIds: appliesTo === EDiscountAppliesTo.All ? [] : productIds,
    });
    console.log(newDiscount, "====newDiscount===")

    return newDiscount;
  }

  static async updateDiscountCode(payload: TCreateDiscountCode) {
    // ...
  }

  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }: TGetAllDiscountCodesWithProduct) {
    console.log(code, shopId, "===shopId====")
    const foundDiscount = await discountModel
      .findOne({
        code: code,
        shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (!foundDiscount || (foundDiscount && !foundDiscount.isActive)) {
      throw new NotFoundError('Discount not exists!');
    }

    const { appliesTo, productIds } = foundDiscount;
    if (appliesTo === EDiscountAppliesTo.All) {
      // get all products
      const products = await findAllProducts({
        filter: {
          shop: convertToObjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['name'],
      });

      return products;
    } else {
      // get the products ids
      const products = await findAllProducts({
        filter: {
          _id: { $in: productIds },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['name'],
      });

      return products;
    }
  }

  static async getAllDiscountCodesByShop({
    limit = 50,
    page = 1,
    shopId,
  }: TGetAllDiscountCodesByShop) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        shopId: convertToObjectIdMongodb(shopId),
      },
      unSelect: ['__v', 'shopId'],
    });

    return discounts;
  }

  /*
    apply discount
  */
  static async getDiscountAmount({
    code,
    shopId,
    userId,
    products,
  }: TGetDiscountAmount) {
    const foundDiscount = await checkDiscountExists(discountModel, {
      code: code,
      shopId: convertToObjectIdMongodb(shopId),
    });

    if (!foundDiscount) throw new NotFoundError('Discount not exists!');

    const {
      isActive,
      maxUses,
      startDate,
      endDate,
      minOrderValue,
      maxUsesPerUser,
      usersUsed,
      type,
      value,
    } = foundDiscount;

    if (!isActive) throw new NotFoundError('Discount expired!');
    if (!maxUses) throw new NotFoundError('Discounts are out!');

    if (new Date() < new Date(startDate) || new Date() > new Date(endDate)) {
      throw new NotFoundError('Discount code has expired!');
    }

    // Check xem có set giá trị tối thiểu hay k
    let totalOrder = 0;
    if (minOrderValue > 0) {
      // get total
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < minOrderValue) {
        throw new NotFoundError(
          `Discount requires a minimum order value of ${minOrderValue}!`
        );
      }
    }

    if (maxUsesPerUser > 0) {
      const userUseDiscount = usersUsed.find(
        (user: any) => (user.userId = userId)
      );
      if (userUseDiscount) {
        // ....
      }
    }

    // check xem discount này có fixed amount không
    const amount =
      type === EDiscountType.Money ? value : totalOrder * (value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  /**
   * delete discount
   */
  static async deleteDiscountCode({ shopId, code }: TDeleteDiscountCode) {
    // Đây là cách đơn giản, chúng ta cần kiểm tra trước discount đó đã được sử dụng ở đâu chưa, rồi xử lý tiếp ....
    const deleted = await discountModel.findByIdAndDelete({
      code: code,
      shopId: convertToObjectIdMongodb(shopId),
    });

    return deleted;
  }

  /**
   * Cancel discount code
   */
  static async cancelDiscountCode({
    code,
    shopId,
    userId,
  }: TCancelDiscountCode) {
    const foundDiscount = await checkDiscountExists(discountModel, {
      code,
      shopId: convertToObjectIdMongodb(shopId),
    });

    if (!foundDiscount) throw new NotFoundError(`Discount doesn't exists!`);

    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        usersUsed: userId,
      },
      $inc: {
        maxUses: 1,
        usedCount: -1,
      },
    });

    return result;
  }
}

export default DiscountService;

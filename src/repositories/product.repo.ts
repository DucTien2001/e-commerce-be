'use strict';

import { Types } from 'mongoose';
import productModel from '../models/product.model';
import {
  TFind,
  TFindPagination,
  TFindProduct,
  TPublishProductByShop,
  TSearch,
  TUnPublishProductByShop,
  TUpdateProduct,
} from '../interfaces';
import { getSelectData, unGetSelectData } from '../utils';

export const finAllDraftsForShop = async ({ query, limit, skip }: TFind) => {
  return await queryProduct({ query, limit, skip });
};

export const finAllPublishForShop = async ({ query, limit, skip }: TFind) => {
  return await queryProduct({ query, limit, skip });
};

export const searchProductByUser = async ({ keySearch }: TSearch) => {
  const regexSearch = new RegExp(keySearch);
  const results = await productModel
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch as any },
      },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean();
  return results;
};

export const findAllProducts = async ({
  limit,
  sort,
  page,
  filter,
  select,
}: TFindPagination) => {
  const skip = (page - 1) * limit;
  const sortBy: any = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const products = await productModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return products;
};

export const findProduct = async ({ productId, unSelect }: TFindProduct) => {
  return await productModel
    .findById(productId)
    .select(unGetSelectData(unSelect));
};

export const updateProductById = async ({
  productId,
  payload,
  model,
  isNew = true,
}: TUpdateProduct) => {
  return await model.findByIdAndUpdate(productId, payload, {
    new: isNew,
  });
};

export const publishProductByShop = async ({
  shop,
  id,
}: TPublishProductByShop) => {
  const foundShop = await productModel.findOne({
    shop: shop,
    _id: id,
  });
  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublished = true;

  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};

export const unPublishProductByShop = async ({
  shop,
  id,
}: TUnPublishProductByShop) => {
  const foundShop = await productModel.findOne({
    shop: shop,
    _id: id,
  });
  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublished = false;

  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};

const queryProduct = async ({ query, limit, skip }: TFind) => {
  return await productModel
    .find(query)
    .populate('shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

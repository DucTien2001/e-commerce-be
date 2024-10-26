'use strict';

import {
  TFindAllDiscountCodesSelect,
  TFindAllDiscountCodesUnSelect,
} from '../interfaces';
import discountModel from '../models/discount.model';
import { getSelectData, unGetSelectData } from '../utils';

export const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  select,
}: TFindAllDiscountCodesSelect) => {
  const skip = (page - 1) * limit;
  const sortBy: any = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const discounts = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return discounts;
};

export const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  page = 1,
  sort = 'ctime',
  filter,
  unSelect,
}: TFindAllDiscountCodesUnSelect) => {
  const skip = (page - 1) * limit;
  const sortBy: any = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const discounts = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean();

  return discounts;
};

export const checkDiscountExists = async (model: any, filter: object) => {
  return await model.findOne(filter).lean();
};

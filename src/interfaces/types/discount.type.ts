import { EDiscountAppliesTo, EDiscountType } from '../enums';
import { TProduct } from './product.type';

export type TCreateDiscountCode = {
  code: string;
  startDate: Date;
  endDate: Date;
  shopId: string;
  isActive: boolean;
  value: number;
  minOrderValue?: number;
  productIds: string[];
  appliesTo: EDiscountAppliesTo;
  name: string;
  description: string;
  type: EDiscountType;
  maxValue: number;
  maxUses: number;
  usedCount: number;
  usersUsed: string[];
  maxUsesPerUser: number;
};

export type TGetAllDiscountCodesWithProduct = {
  code: string;
  shopId: string;
  userId: string;
  limit: number;
  page: number;
};

export type TFindAllDiscountCodesUnSelect = {
  limit?: number;
  page?: number;
  sort?: string;
  filter: any;
  unSelect: string[];
};

export type TFindAllDiscountCodesSelect = {
  limit?: number;
  page?: number;
  sort?: string;
  filter: any;
  select: string[];
};

export type TGetAllDiscountCodesByShop = {
  limit?: number;
  page?: number;
  shopId: string;
};

export type TGetDiscountAmount = {
  code: string;
  shopId: string;
  userId: string;
  products: TProduct[];
};

export type TDeleteDiscountCode = {
  code: string;
  shopId: string;
};

export type TCancelDiscountCode = {
  code: string;
  shopId: string;
  userId: string;
};

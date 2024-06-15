import { TShopFindByEmail } from '../interfaces/types';
import shopModel from '../models/shop.model';

export default class ApiShopService {
  static findByEmail = async ({
    email,
    select = {
      email: 1,
      password: 2,
      name: 1,
      status: 1,
      role: 1,
    },
  }: TShopFindByEmail) => {
    return await shopModel.findOne({ email }).select(select).lean();
  };
}

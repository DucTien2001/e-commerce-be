'use strict';

import apikeyModel from '../models/apikey.model';

class ApiKeyService {
  static findById = async (key: string) => {
    const objkey = await apikeyModel.findOne({ key, status: true }).lean();
    return objkey;
  };
}

export default ApiKeyService;

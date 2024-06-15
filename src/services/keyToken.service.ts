'use strict';

import { Types } from 'mongoose';
import { TCreateKeyToken } from '../interfaces/types';
import keytokenModel from '../models/keytoken.model';

class KeyTokenService {
  // High level
  // static createKeyToken = async ({userId, publicKey}) => {
  //   try {
  //     const publicKeyString = publicKey.toString();
  //     const tokens = await keytokenModel.create({
  //       user: userId,
  //       publicKey: publicKeyString,
  //     });

  //     return tokens ? tokens.publicKey : null;
  //   } catch (error) {
  //     return error;
  //   }
  // };

  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }: TCreateKeyToken) => {
    try {
      // Level 0
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });

      // return tokens ? tokens.publicKey : null;

      // Level 1
      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = {
        upsert: true,
        new: true,
      };
      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId: string) => {
    return await keytokenModel.findOne({ user: userId });
  };

  static removeKeyById = async (id: Types.ObjectId) => {
    return await keytokenModel.deleteOne(id);
  };

  static findByRefreshTokenUsed = async (refreshToken: string) => {
    return await keytokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  static findByRefreshToken = async (refreshToken: string) => {
    return await keytokenModel.findOne({ refreshToken });
  };

  static deleteKeyById = async (userId: Types.ObjectId) => {
    return await keytokenModel.deleteOne({ user: userId });
  };
}

export default KeyTokenService;

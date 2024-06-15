'use strict';

import shopModel from '../models/shop.model';
import bcrypt from 'bcrypt';
// const crypto = require('crypto');
import crypto from 'node:crypto';
import { createTokenPair } from '../auth/authUtils';
// import { getInfoData } from '../utils';
import { TShopSignUp } from '../interfaces/types';
import KeyTokenService from './keyToken.service';
import { getInfoData } from '../utils';
import {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} from '../core/error.response';
import { EShopRole } from '../interfaces';
// const { findByEmail } = require('./shop.service');

class AccessService {
  static signup = async ({ name, email, password }: TShopSignUp) => {
    // try {
    // step1: check email exists??
    const hodelShop = await shopModel.findOne({ email }).lean();
    if (hodelShop) {
      throw new BadRequestError('Shop already registered!');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [EShopRole.SHOP],
    });
    if (newShop) {
      // create privateKey, publicKey
      // High level
      // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: 'pkcs1', // Public Key CryptoGraphy Standards
      //     format: 'pem',
      //   },
      //   privateKeyEncoding: {
      //     type: 'pkcs1', // Public Key CryptoGraphy Standards
      //     format: 'pem',
      //   },
      // });

      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');
      // console.log({ privateKey, publicKey }); // save collection KeyStore

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        return {
          code: 'xxx',
          message: 'keyStore error!',
        };
      }

      // const publicKeyObject = crypto.createPublicKey(publicKeyString);
      // create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      console.log(`create token success: `, tokens);

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ['_id', 'name', 'email'],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
    // } catch (error) {
    //   return {
    //     code: 'xxx',
    //     message: error.message,
    //     status: 'error',
    //   };
    // }
  };

  /*
    1 - check email in dbs
    2 - match password
    3 - create access token vs refresh token and save
    4 - generate tokens
    5 - get data return login
  */
  // static login = async ({ email, password, refreshToken = null }) => {
  //   console.log(email, password, '==email, password==');
  //   // 1
  //   const foundShop = await findByEmail({ email });
  //   console.log(foundShop, '==foundShop=_');
  //   if (!foundShop) throw new BadRequestError('Shop is not registered');

  //   // 2
  //   const match = bcrypt.compare(password, foundShop.password);
  //   if (!match) throw new AuthFailureError('Authentication error');

  //   // 3
  //   const privateKey = crypto.randomBytes(64).toString('hex');
  //   const publicKey = crypto.randomBytes(64).toString('hex');

  //   // 4
  //   const tokens = await createTokenPair(
  //     { userId: foundShop._id, email },
  //     publicKey,
  //     privateKey
  //   );

  //   await KeyTokenService.createKeyToken({
  //     userId: foundShop._id,
  //     refreshToken: tokens.refreshToken,
  //     privateKey,
  //     publicKey,
  //   });
  //   return {
  //     shop: getInfoData({
  //       fields: ['_id', 'name', 'email'],
  //       object: foundShop,
  //     }),
  //     tokens,
  //   };
  // };

  // static logout = async ({ keyStore }) => {
  //   const delKey = KeyTokenService.removeKeyById(keyStore._id);
  //   console.log(delKey, '==delKey===');
  //   return delKey;
  // };

  // /*
  //   1. check this token used?
  // */
  // static handleRefreshToken = async (refreshToken) => {
  //   const foundToken = await KeyTokenService.findByRefreshTokenUsed(
  //     refreshToken
  //   );
  //   if (foundToken) {
  //     // decode to check who is using it
  //     const { userId, email } = await verifyJWT(
  //       refreshToken,
  //       foundToken.privateKey
  //     );
  //     console.log({ userId, email }, '==={userId, email}===');
  //     // Delete all tokens in keyStore
  //     await KeyTokenService.deleteKeyById(userId);
  //     throw new ForbiddenError('Something wrong happend! Please relogin');
  //   }

  //   const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
  //   console.log(holderToken, '===holderToken====');
  //   if (!holderToken) throw new AuthFailureError('Shop not registered');

  //   // check token
  //   const { userId, email } = await verifyJWT(
  //     refreshToken,
  //     holderToken.privateKey
  //   );
  //   // check user id
  //   const foundShop = await findByEmail({ email });
  //   if (!foundShop) throw new AuthFailureError('Shop not registered');

  //   // create a new pair token
  //   const tokens = await createTokenPair(
  //     { userId, email },
  //     holderToken.publicKey,
  //     holderToken.privateKey
  //   );
  //   // update token
  //   await holderToken.updateOne({
  //     $set: {
  //       refreshToken: tokens.refreshToken,
  //     },
  //     $addToSet: {
  //       refreshTokensUsed: refreshToken,
  //     },
  //   });

  //   return {
  //     user: { userId, email },
  //     tokens,
  //   };
  // };

  // static handleRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
  //   const { userId, email } = user;
  //   if (keyStore.refreshTokensUsed.includes(refreshToken)) {
  //     await KeyTokenService.deleteKeyById(userId);
  //     throw new ForbiddenError('Something wrong happend! Please relogin');
  //   }

  //   if (keyStore.refreshToken !== refreshToken)
  //     throw new AuthFailureError('Shop not registered');

  //   // check user id
  //   const foundShop = await findByEmail({ email });
  //   if (!foundShop) throw new AuthFailureError('Shop not registered');

  //   // create a new pair token
  //   const tokens = await createTokenPair(
  //     { userId, email },
  //     keyStore.publicKey,
  //     keyStore.privateKey
  //   );
  //   // update token
  //   await keyStore.updateOne({
  //     $set: {
  //       refreshToken: tokens.refreshToken,
  //     },
  //     $addToSet: {
  //       refreshTokensUsed: refreshToken,
  //     },
  //   });

  //   return {
  //     user: { userId, email },
  //     tokens,
  //   };
  // };
}

export default AccessService;

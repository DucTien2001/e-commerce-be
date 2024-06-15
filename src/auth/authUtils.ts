'use strict';

import JWT from 'jsonwebtoken';
import asyncHandler from '../helpers/asyncHandler';
// import { findByUserId } from '../services/keyToken.service';

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESHTOKEN: 'x-rtoken-id',
};

export const createTokenPair = async (
  payload: any,
  publicKey: string,
  privateKey: string
) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      // algorithm: 'RS256',
      expiresIn: '2 days',
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: 'RS256',
      expiresIn: '7 days',
    });

    //
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(err);
      } else {
        console.log(decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};

// const authentication = asyncHandler(async (req, res, next) => {
//   /*
//     1 - check userId missing
//     2 - get access token
//     3 - verify token
//     4 - check user in dbs
//     5 - check keystore with this user
//     6 - OK all -> return next()
//   */
//   //  1
//   const userId = req.headers[HEADER.CLIENT_ID];
//   if (!userId) throw new AuthFailureError('Invalid Request');

//   // 2
//   const keyStore = await findByUserId(userId);
//   if (!keyStore) throw new NotFoundError('Not found keyStore');

//   // 3
//   const accessToken = req.headers[HEADER.AUTHORIZATION];
//   if (!accessToken) throw new AuthFailureError('Invalid Request');

//   try {
//     const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
//     if (userId !== decodeUser.userId)
//       throw new AuthFailureError('Invalid Request');
//     req.keyStore = keyStore;
//     return next();
//   } catch (error) {
//     throw error;
//   }
// });

// const authenticationV2 = asyncHandler(async (req, res, next) => {
//   /*
//     1 - check userId missing
//     2 - get access token
//     3 - verify token
//     4 - check user in dbs
//     5 - check keystore with this user
//     6 - OK all -> return next()
//   */
//   //  1
//   const userId = req.headers[HEADER.CLIENT_ID];
//   if (!userId) throw new AuthFailureError('Invalid Request');

//   // 2
//   const keyStore = await findByUserId(userId);
//   if (!keyStore) throw new NotFoundError('Not found keyStore');

//   // 3
//   if (req.headers[HEADER.REFRESHTOKEN]) {
//     try {
//       const refreshToken = req.headers[HEADER.REFRESHTOKEN];
//       const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
//       if (userId !== decodeUser.userId)
//         throw new AuthFailureError('Invalid Request');
//       req.keyStore = keyStore;
//       req.user = decodeUser;
//       req.refreshToken = refreshToken;
//       return next();
//     } catch (error) {
//       throw error;
//     }
//   }
//   const accessToken = req.headers[HEADER.AUTHORIZATION];
//   if (!accessToken) throw new AuthFailureError('Invalid Request');

//   try {
//     const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
//     if (userId !== decodeUser.userId)
//       throw new AuthFailureError('Invalid Request');
//     req.keyStore = keyStore;
//     req.user = decodeUser;
//     return next();
//   } catch (error) {
//     throw error;
//   }
// });

export const verifyJWT = async (token: string, keySecret: string) => {
  return await JWT.verify(token, keySecret);
};

'use strict';

import { Request, Response, NextFunction } from 'express';
import ApiKeyService from '../services/apikey.service';
// import apikeyModel from '../models/apikey.model';
// import crypto from 'node:crypto';
import { FlattenMaps, Types } from 'mongoose';

type TRequestCustom = Request & {
  objKey?: FlattenMaps<{
    _id: Types.ObjectId;
    key: string;
    status: boolean;
    permissions: string[];
    createdAt: NativeDate;
    updatedAt: NativeDate;
  }>;
};

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};

export const apiKey = async (
  req: TRequestCustom,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log(req, '===req2====');

    // const newKey = await apikeyModel.create({
    //   key: crypto.randomBytes(64).toString('hex'),
    //   permissions: '0000',
    // });
    // console.log(newKey,"=adsadas===");
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: 'Forbidden error',
      });
    }
    // Check objKey
    const objKey = await ApiKeyService.findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden error',
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {}
};

export const permission = (permissions: string) => {
  return (req: TRequestCustom, res: Response, next: NextFunction) => {
    if (!req?.objKey?.permissions) {
      return res.status(403).json({
        message: 'Permission denied',
      });
    }

    const validPermission = req.objKey.permissions.includes(permissions);
    if (!validPermission) {
      return res.status(403).json({
        message: 'Permission denied',
      });
    }

    return next();
  };
};

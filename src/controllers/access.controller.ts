'use strict';

import { NextFunction, Request, Response } from 'express';
import { CREATED, SuccessResponse } from '../core/success.response';
import AccessService from '../services/access.service';

class AccessController {
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    /**
     * 200 OK
     * 201 CREATED
     */
    console.log(req.body, '===req 1==');
    new CREATED({
      message: 'Registered OK!',
      metadata: await AccessService.signup(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };

  // login = async (req, res, next) => {
  //   new SuccessResponse({
  //     metadata: await AccessService.login(req.body),
  //   }).send(res);
  // };

  // logout = async (req, res, next) => {
  //   new SuccessResponse({
  //     message: 'Logout success',
  //     metadata: await AccessService.logout({ keyStore: req.keyStore }),
  //   }).send(res);
  // };

  // handleRefreshToken = async (req, res, next) => {
  //   // new SuccessResponse({
  //   //   message: 'Get token success',
  //   //   metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
  //   // }).send(res);

  //   // v2 fixed
  //   new SuccessResponse({
  //     message: 'Get token success',
  //     metadata: await AccessService.handleRefreshTokenV2({
  //       refreshToken: req.refreshToken,
  //       user: req.user,
  //       keyStore: req.keyStore,
  //     }),
  //   }).send(res);
  // };
}

export default new AccessController();

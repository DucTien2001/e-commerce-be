'use strict';

import express from 'express';
import accessController from '../controllers/access.controller';
import asyncHandler from '../helpers/asyncHandler';
const accessRouter = express.Router();

// accessRouter.post('/shop/signup', accessController.signUp);
accessRouter.post('/shop/signup', asyncHandler(accessController.signUp));
// router.post('/shop/login', asyncHandler(accessController.login));

// // authentication
// router.use(authenticationV2);
// router.post('/shop/logout', asyncHandler(accessController.logout));
// router.post(
//   '/shop/refresh-token',
//   asyncHandler(accessController.handleRefreshToken)
// );

export default accessRouter;

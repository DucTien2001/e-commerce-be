'use strict';

import express from 'express';
import accessController from '../controllers/access.controller';
import asyncHandler from '../helpers/asyncHandler';
import { authenticationV2 } from '../auth/authUtils';
const accessRouter = express.Router();

// accessRouter.post('/shop/signup', accessController.signUp);
accessRouter.post('/shop/signup', asyncHandler(accessController.signUp));
accessRouter.post('/shop/login', asyncHandler(accessController.login));

// authentication
accessRouter.use(authenticationV2);
accessRouter.post('/shop/logout', asyncHandler(accessController.logout));
accessRouter.post(
  '/shop/refresh-token',
  asyncHandler(accessController.handleRefreshToken)
);

export default accessRouter;

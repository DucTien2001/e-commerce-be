'use strict';

import express from 'express';
import { authenticationV2 } from '../auth/authUtils';
import asyncHandler from '../helpers/asyncHandler';
import ProductController from '../controllers/product.controller';
const router = express.Router();

// authentication
router.use(authenticationV2);

router.post('', asyncHandler(ProductController.createProduct));

export default router;

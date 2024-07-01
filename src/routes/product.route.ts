'use strict';

import express from 'express';
import { authenticationV2 } from '../auth/authUtils';
import asyncHandler from '../helpers/asyncHandler';
import ProductController from '../controllers/product.controller';
const router = express.Router();

router.get(
  '/search/:keySearch',
  asyncHandler(ProductController.getListSearchProduct)
);
router.get('', asyncHandler(ProductController.findAllProducts));
router.get('/:id', asyncHandler(ProductController.findProduct));

// authentication
router.use(authenticationV2);

router.post('', asyncHandler(ProductController.createProduct));
router.patch('/:id', asyncHandler(ProductController.updateProduct));
router.post(
  '/publish/:id',
  asyncHandler(ProductController.publishProductByShop)
);
router.post(
  '/unpublish/:id',
  asyncHandler(ProductController.unPublishProductByShop)
);

// QUERY
router.get('/drafts/all', asyncHandler(ProductController.getAllDraftsForShop));
router.get(
  '/published/all',
  asyncHandler(ProductController.getAllPublishForShop)
);

export default router;

'use strict';

import express from 'express';
import { authenticationV2 } from '../auth/authUtils';
import asyncHandler from '../helpers/asyncHandler';
import discountController from '../controllers/discount.controller';
const router = express.Router();

// get amount a discount
router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.get(
  '/list-product-code',
  asyncHandler(discountController.getAllDiscountCodesWithProduct)
);

// authentication
router.use(authenticationV2);

router.post('', asyncHandler(discountController.createDiscountCode));
router.get('', asyncHandler(discountController.getAllDiscountCodesByShop));

export default router;

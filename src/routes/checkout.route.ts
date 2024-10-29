"use strict";

import express from "express";
import checkoutController from "../controllers/checkout.controller";
import asyncHandler from "../helpers/asyncHandler";
const router = express.Router();

router.post("/review", asyncHandler(checkoutController.checkoutReview));

export default router;

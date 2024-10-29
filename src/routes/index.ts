"use strict";

import express from "express";
import accessRouter from "./access.route";
import productRouter from "./product.route";
import discountRouter from "./discount.route";
import checkoutRouter from "./checkout.route";
import inventoryRouter from "./inventory.route";
import cardRouter from "./card.route";
import commentRouter from "./comment.route";
import { apiKey, permission } from "../auth/checkAuth";

const router = express.Router();

// Check apikey
router.use(apiKey);
// Check permission
router.use(permission("0000"));

router.use("/v1/api/discount", discountRouter);
router.use("/v1/api/checkout", checkoutRouter);
router.use("/v1/api/inventory", inventoryRouter);
router.use("/v1/api/comment", commentRouter);
router.use("/v1/api/card", cardRouter);
router.use("/v1/api/product", productRouter);
router.use("/v1/api", accessRouter);

// router.get('/', (req, res, next) => {
//   return res.status(200).json({
//     messsage: 'Test',
//   });
// });
export default router;

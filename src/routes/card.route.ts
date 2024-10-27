"use strict";

import express from "express";
import cardController from "../controllers/card.controller";
import asyncHandler from "../helpers/asyncHandler";
const router = express.Router();

router.post("", asyncHandler(cardController.addToCard));
router.delete("", asyncHandler(cardController.delete));
router.post("/update", asyncHandler(cardController.update));
router.get("", asyncHandler(cardController.getListUserCard));

export default router;

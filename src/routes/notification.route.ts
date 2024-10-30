"use strict";

import express from "express";
import asyncHandler from "../helpers/asyncHandler";
import { authenticationV2 } from "../auth/authUtils";
import notificationController from "../controllers/notification.controller";
const router = express.Router();

router.use(authenticationV2);

router.get("/", asyncHandler(notificationController.getListNotiByUser));

export default router;

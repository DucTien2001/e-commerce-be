"use strict";

import express from "express";
import commentController from "../controllers/comment.controller";
import asyncHandler from "../helpers/asyncHandler";
const router = express.Router();

router.post("/", asyncHandler(commentController.createComment));
router.get("/", asyncHandler(commentController.getCommentsByParentId));
router.delete("/", asyncHandler(commentController.deleteComment));

export default router;

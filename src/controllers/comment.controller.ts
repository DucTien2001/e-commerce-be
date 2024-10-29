import { NextFunction, Response } from "express";
import { SuccessResponse } from "../core/success.response";
import { MyRequest, TGetCommentsByParentId } from "../interfaces";
import CommentService from "../services/comment.service";

class CommentController {
  // create comment
  createComment = async (req: MyRequest, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Create comment success",
      metadata: await CommentService.createComment({
        ...req.body,
      }),
    }).send(res);
  };

  // Get Comments By ParentId
  getCommentsByParentId = async (
    req: MyRequest,
    res: Response,
    next: NextFunction
  ) => {
    new SuccessResponse({
      message: "Create comment success",
      metadata: await CommentService.getCommentsByParentId({
        ...(req.query as unknown as TGetCommentsByParentId),
      }),
    }).send(res);
  };

  // Delete comment
  deleteComment = async (req: MyRequest, res: Response, next: NextFunction) => {
    new SuccessResponse({
      message: "Delete comment success",
      metadata: await CommentService.deleteComment({
        ...req.body,
      }),
    }).send(res);
  };
}

export default new CommentController();

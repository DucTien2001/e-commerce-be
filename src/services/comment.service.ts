"use strict";

import { NotFoundError } from "../core/error.response";
import {
  TCreateComment,
  TDeleteComment,
  TGetCommentsByParentId,
} from "../interfaces";
import commentModel from "../models/comment.model";
import { findProduct } from "../repositories/product.repo";
import { convertToObjectIdMongodb } from "../utils";

/*
    key features: Comment service
    + add comment [User, Shop]
    + get a list of comments [User, Shop]
    + delete a comment [User | Shop | Admin]
*/
class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }: TCreateComment) {
    const comment = new commentModel({
      productId: productId,
      userId: userId,
      content: content,
      parentId: parentCommentId,
    });

    let rightValue = 1;
    if (parentCommentId) {
      // reply comment
      const parentComment = await commentModel.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError("Parent comment not found!");

      rightValue = parentComment.right;
      // update many comments
      await commentModel.updateMany(
        {
          productId: convertToObjectIdMongodb(productId),
          right: { $gte: rightValue },
        },
        {
          $inc: { right: 2 },
        }
      );

      await commentModel.updateMany(
        {
          productId: convertToObjectIdMongodb(productId),
          left: { $gt: rightValue },
        },
        {
          $inc: { left: 2 },
        }
      );
    } else {
      const maxRightValue = await commentModel.findOne(
        {
          productId: convertToObjectIdMongodb(productId),
        },
        "right",
        { sort: { right: -1 } }
      );

      if (maxRightValue) {
        rightValue = maxRightValue.right + 1;
      } else {
        rightValue = 1;
      }
    }

    // Insert comment
    comment.left = rightValue;
    comment.right = rightValue + 1;

    await comment.save();
    return comment;
  }

  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0,
  }: TGetCommentsByParentId) {
    if (parentCommentId) {
      const parent = await commentModel.findById(parentCommentId);

      if (!parent) throw new NotFoundError("Not found comment for product");

      const comments = await commentModel
        .find({
          productId: convertToObjectIdMongodb(productId),
          left: {
            $gt: parent.left,
          },
          right: {
            $lte: parent.right,
          },
        })
        .select({
          left: 1,
          right: 1,
          content: 1,
          parentId: 1,
        })
        .sort({ left: 1 });

      return comments;
    }

    // Lấy gốc
    const comments = await commentModel
      .find({
        productId: convertToObjectIdMongodb(productId),
        // parentId: null,
      })
      .select({
        left: 1,
        right: 1,
        content: 1,
        parentId: 1,
      })
      .sort({ left: 1 });

    return comments;
  }

  // delete comments
  static async deleteComment({ commentId, productId }: TDeleteComment) {
    // check the product exist in the database
    const foundProduct = await findProduct({
      productId: convertToObjectIdMongodb(productId),
    });

    if (!foundProduct) throw new NotFoundError("Product not found");

    // 1. xac dinh gia tri left vaf right cua comment
    const comment = await commentModel.findById(commentId);
    if (!comment) throw new NotFoundError("Comment not found");

    const leftValue = comment.left;
    const rightValue = comment.right;

    // 2. tinh width
    const width = rightValue - leftValue + 1;

    // 3. xoa tat ca comment con
    await commentModel.deleteMany({
      productId: convertToObjectIdMongodb(productId),
      left: { $gte: leftValue, $lte: rightValue },
    });

    // 4. cap nhat lai gia tri left va right con lai
    await commentModel.updateMany(
      {
        productId: convertToObjectIdMongodb(productId),
        right: { $gt: rightValue },
      },
      { $inc: { right: -width } }
    );

    await commentModel.updateMany(
      {
        productId: convertToObjectIdMongodb(productId),
        left: { $gt: rightValue },
      },
      { $inc: { left: -width } }
    );
  }
}

export default CommentService;

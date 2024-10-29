export type TCreateComment = {
  productId: string;
  userId: number;
  content: string;
  parentCommentId: string | null;
};

export type TGetCommentsByParentId = {
  productId: string;
  parentCommentId: string | null;
  limit: number;
  offset: number;
};

export type TDeleteComment = {
  commentId: string;
  productId: string;
};

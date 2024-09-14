export interface CommentDto {
  id?: number;
  artworkId: number;
  userId: number;
  username?: string;
  commentText: string;
  createDate?: Date;
}

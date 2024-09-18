export interface CommentDto {
  id?: number;
  artworkId: number;
  userId: number;
  username?: string;
  profilePicture?: string;
  commentText: string;
  createDate?: Date;
}

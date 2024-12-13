export interface Notification {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  link?: string; // Facoltativo, poiché potrebbe non essere sempre presente
  date: Date;
  isRead: boolean;
}

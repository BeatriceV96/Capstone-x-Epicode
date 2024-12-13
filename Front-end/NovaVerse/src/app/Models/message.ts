export interface Message {
  id?: number; // ID opzionale per nuovi messaggi
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: Date;
  isRead: boolean;
  senderUsername: string; // Nome utente del mittente
  receiverUsername: string; // Nome utente del destinatario
  senderProfilePicture: string; // Foto profilo del mittente
  receiverProfilePicture: string; // Foto profilo del destinatario
}

export interface iUser {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;  // Ruolo dell'utente (Artist o Buyer)
  bio: string;   // Biografia dell'utente
  profilePictureUrl: string;  // URL della foto profilo
  createDate: Date;  // Data di creazione
}

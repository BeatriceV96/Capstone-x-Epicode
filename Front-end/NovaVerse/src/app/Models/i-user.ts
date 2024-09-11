export interface iUser {
  id: number;
  username: string;
  email: string;
  role: string;        // Ruolo dell'utente (Artist o Buyer)
  bio: string;         // Biografia dell'utente
  profilePicture: Uint8Array; // La foto profilo come byte[]
  createDate: Date;    // Data di creazione
}

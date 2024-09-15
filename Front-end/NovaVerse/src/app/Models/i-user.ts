import { Artwork } from "./artwork";

export interface iUser {
  id: number;
  username: string;
  email: string;
  role: string;        // Ruolo dell'utente (Artist o Buyer)
  bio: string;         // Biografia dell'utente
  profilePicture?: string;
  createDate: Date;    // Data di creazione
  artworks?: Artwork[];
}

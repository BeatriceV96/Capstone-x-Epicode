export interface Artwork {
  id: number;
  title: string;
  description: string;
  price: number;
  photo?: string;
  imageUrl?: string;  // Per gestire un URL dell'immagine se è presente
  categoryId: number;
  type: ArtworkType;
  artistId: number;
  artistName?: string; // Nome o username dell'artista (opzionale)
  createDate: Date;
  viewCount: number;
  soldOut?: boolean;
  likesCount?: number;  // Numero di "mi piace"
  commentsCount?: number;  // Numero di commenti
  isFavorite?: boolean;  // Indica se l'opera è tra i preferiti dell'utente attuale
}

export enum ArtworkType {
  Opere = 'Opere',
  NFT = 'NFT'
}

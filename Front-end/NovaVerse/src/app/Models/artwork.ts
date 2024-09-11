export interface Artwork {
  id: number;
  title: string;
  description: string;
  price: number;
  photo?: Uint8Array; // L'immagine caricata come byte[]
  imageUrl?: string;  // Aggiungi questa proprietà se devi gestire URL
  categoryId: number;
  type: ArtworkType;
  artistId: number;
  createDate: Date;
  viewCount: number;
}


export enum ArtworkType {
  Opere = 'Opere',
  NFT = 'NFT'
}

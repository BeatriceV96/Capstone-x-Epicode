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
  createDate: Date;
  viewCount: number;
}

export enum ArtworkType {
  Opere = 'Opere',
  NFT = 'NFT'
}

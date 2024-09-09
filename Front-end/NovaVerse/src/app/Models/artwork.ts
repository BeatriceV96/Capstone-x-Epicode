export interface Artwork {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  type: ArtworkType; // Enum per il tipo (Opere o NFT)
  artistId: number;
  createDate: Date;
  viewCount: number;
}

export enum ArtworkType {
  Opere = 'Opere',
  NFT = 'NFT'
}

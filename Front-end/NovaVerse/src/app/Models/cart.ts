export interface CartItem {
  id: number;
  artworkId: number;
  artworkTitle: string;
  priceAtAddTime: number;
  quantity: number;
  totalPrice: number;
  artworkPhoto?: string;
  artworkImageUrl?: string;
  artistName: string; // Nome dell'artista
  removing?: boolean;
}

export interface Cart {
  id: number;
  userId: number;
  createDate: Date;
  items: CartItem[];
  totalCost: number;
}

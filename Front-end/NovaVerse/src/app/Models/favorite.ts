import { Artwork } from './artwork';

export interface Favorite {
  id: number;
  userId: number;
  artwork?: Artwork;  // Opera d'arte collegata al preferito
  artworkId?: number;
  artistId?: number | null;  // ID dell'artista se il preferito è un artista
  createDate: Date;
}


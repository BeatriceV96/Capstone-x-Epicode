import { Artwork } from "./artwork";

export interface ArtworkResponse {
  artworks: Artwork[];
  totalArtworks: number;
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artwork } from '../Models/artwork';
import { ArtworkSummary } from '../Models/artwork-summary';


@Injectable({
  providedIn: 'root'
})
export class ArtworkService {
  private baseUrl = 'http://localhost:5034/api/artistArtwork';  // URL del backend

  constructor(private http: HttpClient) {}

  // Ottieni tutte le opere d'arte
  getAllArtworks(): Observable<Artwork[]> {
    return this.http.get<Artwork[]>(`${this.baseUrl}/all`);
  }

  // Ottieni una singola opera d'arte per ID
  getArtworkById(id: number): Observable<Artwork> {
    return this.http.get<Artwork>(`${this.baseUrl}/${id}`);
  }

  // Crea una nuova opera d'arte
  createArtwork(artwork: Partial<Artwork>): Observable<Artwork> {
    return this.http.post<Artwork>(`${this.baseUrl}/create`, artwork);
  }

  // Aggiorna un'opera d'arte esistente
  updateArtwork(id: number, artwork: Partial<Artwork>): Observable<Artwork> {
    return this.http.put<Artwork>(`${this.baseUrl}/update/${id}`, artwork);
  }

  // Elimina un'opera d'arte
  deleteArtwork(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

  // Ottieni un riassunto delle statistiche per le opere d'arte
  getArtworkSummary(): Observable<ArtworkSummary[]> {
    return this.http.get<ArtworkSummary[]>(`${this.baseUrl}/summary`);
  }
}

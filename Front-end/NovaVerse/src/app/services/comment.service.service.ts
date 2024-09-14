import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private baseUrl = 'http://localhost:5034/api/comments'; // Modifica l'URL di base per corrispondere al tuo backend

  constructor(private http: HttpClient) {}

  // Ottiene tutti i commenti per un'opera specifica
  getCommentsByArtwork(artworkId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/artwork/${artworkId}`);
  }

  // Aggiunge un nuovo commento
  addComment(commentDto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, commentDto);
  }

  // Aggiorna un commento esistente
  updateComment(commentId: number, commentDto: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${commentId}`, commentDto);
  }

  // Cancella un commento esistente
  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${commentId}`);
  }
}

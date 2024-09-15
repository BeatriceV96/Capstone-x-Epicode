import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentDto } from '../Models/CommentDto';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private baseUrl = 'http://localhost:5034/api/comments';

  constructor(private http: HttpClient) {}

  // Ottiene tutti i commenti per un'opera specifica
  getCommentsByArtwork(artworkId: number): Observable<CommentDto[]> {
    return this.http.get<CommentDto[]>(`${this.baseUrl}/artwork/${artworkId}`);
  }

  // Aggiunge un nuovo commento
  addComment(commentDto: CommentDto): Observable<CommentDto> {
    return this.http.post<CommentDto>(`${this.baseUrl}/add`, commentDto, { withCredentials: true });
  }

  // Aggiorna un commento esistente
  updateComment(commentId: number, commentDto: CommentDto): Observable<CommentDto> {
    return this.http.put<CommentDto>(`${this.baseUrl}/update/${commentId}`, commentDto, { withCredentials: true });
  }

  // Cancella un commento esistente
  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${commentId}`, { withCredentials: true });
  }
}

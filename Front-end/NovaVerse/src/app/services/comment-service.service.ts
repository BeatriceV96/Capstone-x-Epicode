import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { CommentDto } from '../Models/CommentDto';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private baseUrl = 'http://localhost:5034/api/comments';

  constructor(private http: HttpClient) {}

  getCommentsByArtwork(artworkId: number): Observable<CommentDto[]> {
    return this.http.get<{$values: CommentDto[]}>(`${this.baseUrl}/artwork/${artworkId}`, { withCredentials: true }).pipe(
      map(response => response.$values || []),  // Accediamo a $values come fatto per i preferiti
      catchError(error => {
        console.error('Errore nel caricamento dei commenti:', error);
        return [];
      })
    );
  }

  getProfilePictureUrl(profilePicture: string): string {
    if (profilePicture?.startsWith('/uploads')) {
      return 'http://localhost:5034' + profilePicture; // Aggiungi l'URL base se è un percorso relativo
    }
    return profilePicture;
  }


  addComment(commentDto: CommentDto): Observable<CommentDto> {
    return this.http.post<CommentDto>(`${this.baseUrl}/add`, commentDto, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Errore durante l\'aggiunta del commento:', error);
        return throwError(() => error);
      })
    );
  }

  // Aggiorna un commento esistente
  updateComment(commentId: number, commentDto: CommentDto): Observable<CommentDto> {
    return this.http.put<CommentDto>(`${this.baseUrl}/update/${commentId}`, commentDto, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Errore durante l\'aggiornamento del commento:', error);
        return throwError(() => error);
      })
    );
  }


  // Cancella un commento esistente
  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${commentId}`, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Errore durante l\'eliminazione del commento:', error);
        return throwError(() => error);
      })
    );
  }
}

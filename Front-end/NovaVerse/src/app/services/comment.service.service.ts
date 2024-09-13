import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  getCommentsByArtwork(artworkId: number): Observable<any> {
    throw new Error('Method not implemented.');
  }
  private baseUrl = 'http://localhost:5034/api/comments';

  constructor(private http: HttpClient) {}

  addComment(commentDto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, commentDto);
  }

  updateComment(commentId: number, commentDto: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${commentId}`, commentDto);
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${commentId}`);
  }


}

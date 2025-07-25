import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from '../models/note.model';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private apiUrl = '/api/v1/notes';

  constructor(private http: HttpClient) {}

  getAllNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl);
  }

  addNote(note: Omit<Note, 'id'>): Observable<Note> {
    return this.http.post<Note>(`${this.apiUrl}/add-note`, note);
  }

  updateNote(note: Note): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/update-note`, note);
  }

  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-note/${id}`);
  }
}
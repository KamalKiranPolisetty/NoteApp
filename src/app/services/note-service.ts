import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Note } from '../model/Note.model';

@Injectable({
  providedIn: 'root'
})

export class NoteService {

  constructor(private http: HttpClient) {}

  getNotes() {
   return this.http.get<Note[]>('/api/v1/notes');
  }

  addNote(note : Note){
    return this.http.post<Note>('/api/v1/notes/add-note', note);
  }

  updateNote(note: Note) {
    return this.http.put<Note>('/api/v1/notes/update-note', note);
  }

  deleteNote(id: number) {
    return this.http.delete<void>(`/api/v1/notes/delete-note/${id}`);
  }

}

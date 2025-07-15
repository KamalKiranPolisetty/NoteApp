import { Component,inject,signal,input,output } from '@angular/core';
import { NoteService } from '../../services/note-service';
import { Note } from '../../model/Note.model';

@Component({
  selector: 'app-note-card',
  imports: [],
  templateUrl: './note-card.html',
  styleUrl: './note-card.scss'
})
export class NoteCard {

  note = input.required<Note>();

  edit = output<Note>();
  delete = output<number>();

  onEditNote() {
    this.edit.emit(this.note());
  }

  onDeleteNote() {
    this.delete.emit(this.note().id);
  }
}

import { Component, inject, signal } from '@angular/core';
import { NoteService } from '../../services/note-service';
import { Note } from '../../model/Note.model';
import { NoteCard } from '../note-card/note-card';
import { NoteModal } from '../note-modal/note-modal';

@Component({
  selector: 'app-notes-component',
  imports: [NoteCard,NoteModal],
  templateUrl: './notes-component.html',
  styleUrl: './notes-component.scss',
})
export class NotesComponent {
  Notes = signal<Note[]>([]);
  noteService = inject(NoteService);

  constructor() {
    this.getNotes();
  }


  noteModalOpen = signal(false);
selectedNote = signal<Note | null>(null);

openAdd() {
  this.selectedNote.set(null); // create mode
  this.noteModalOpen.set(true);
}

openEdit(note: Note) {
  this.selectedNote.set(note); // edit mode
  this.noteModalOpen.set(true);
}

onModalSubmit(note: Note) {
  if (note.id === 0) {
    this.postNote(note);
  } else {
    this.updateNote(note);
  }
  this.noteModalOpen.set(false);
}

onModalCancel() {
  this.noteModalOpen.set(false);
}


  getNotes() {
    this.noteService.getNotes().subscribe(
      (response: Note[]) => {
        this.Notes.set(response);
      },
      (error: any) => {
        console.error('Error fetching notes:', error);
      }
    );
  }

  postNote(note: Note) {
    this.noteService.addNote(note).subscribe(
      (response: Note) => {
        this.Notes.update((notes: Note[]) => [...notes, response]);
      },
      (error: any) => {
        console.error('Error adding note:', error);
      }
    );
  }

  updateNote(note: Note) {
    this.noteService.updateNote(note).subscribe(
      (response: Note) => {
        this.Notes.update((notes: Note[]) =>
          notes.map(n => n.id === response.id ? response : n)
        );
      },
      (error: any) => {
        console.error('Error updating note:', error);
      }
    );
  }

  deleteNote(noteId: number) {
    this.noteService.deleteNote(noteId).subscribe(
      () => {
        this.Notes.update((notes: Note[]) =>
          notes.filter(note => note.id !== noteId)
        );
      },
      (error: any) => {
        console.error('Error deleting note:', error);
      }
    );
  }
}

import { Component, inject, signal, computed } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';
import { NoteService } from '../../services/note-service';
import { Note } from '../../model/Note.model';
import { NoteCard } from '../note-card/note-card';
import { NoteModal } from '../note-modal/note-modal';

@Component({
  selector: 'app-notes-component',
  standalone: true,
  imports: [NoteCard, NoteModal],
  templateUrl: './notes-component.html',
  styleUrl: './notes-component.scss',
})
export class NotesComponent implements OnInit, OnDestroy {
  Notes = signal<Note[]>([]);
  searchTerm = signal('');
  noteService = inject(NoteService);
  noteModalOpen = signal(false);
  selectedNote = signal<Note | null>(null);

  // Computed property for filtered notes
  filteredNotes = computed(() => {
    const notes = this.Notes();
    const search = this.searchTerm().toLowerCase().trim();
    
    if (!search) {
      return notes;
    }
    
    return notes.filter(note => 
      note.title.toLowerCase().includes(search) || 
      note.description.toLowerCase().includes(search)
    );
  });

  constructor() {
    this.getNotes();
  }

  ngOnInit() {
    // Listen for add note events from sidebar
    document.addEventListener('addNote', this.handleAddNote);
  }

  ngOnDestroy() {
    document.removeEventListener('addNote', this.handleAddNote);
  }

  private handleAddNote = () => {
    this.openAdd();
  }

  openAdd() {
    this.selectedNote.set(null);
    this.noteModalOpen.set(true);
  }

  openEdit(note: Note) {
    this.selectedNote.set(note);
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
    this.noteService.getNotes().subscribe({
      next: (response: Note[]) => {
        this.Notes.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching notes:', error);
        // You could add a toast notification here
      }
    });
  }

  postNote(note: Note) {
    this.noteService.addNote(note).subscribe({
      next: (response: Note) => {
        this.Notes.update((notes: Note[]) => [...notes, response]);
      },
      error: (error: any) => {
        console.error('Error adding note:', error);
      }
    });
  }

  updateNote(note: Note) {
    this.noteService.updateNote(note).subscribe({
      next: (response: Note) => {
        this.Notes.update((notes: Note[]) =>
          notes.map(n => n.id === response.id ? response : n)
        );
      },
      error: (error: any) => {
        console.error('Error updating note:', error);
      }
    });
  }

  deleteNote(noteId: number) {
    if (confirm('Are you sure you want to delete this note?')) {
      this.noteService.deleteNote(noteId).subscribe({
        next: () => {
          this.Notes.update((notes: Note[]) =>
            notes.filter(note => note.id !== noteId)
          );
        },
        error: (error: any) => {
          console.error('Error deleting note:', error);
        }
      });
    }
  }
}
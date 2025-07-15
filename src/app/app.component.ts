import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoteService } from './services/note.service';
import { NoteCardComponent } from './components/note-card/note-card.component';
import { NoteModalComponent } from './components/note-modal/note-modal.component';
import { Note } from './models/note.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HttpClientModule, 
    NoteCardComponent, 
    NoteModalComponent
  ],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="header-content">
          <h1 class="app-title">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10,9 9,9 8,9"></polyline>
            </svg>
            My Notes
          </h1>
          <div class="header-actions">
            <div class="search-container">
              <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input 
                type="text" 
                placeholder="Search notes..." 
                class="search-input"
                [(ngModel)]="searchTerm"
                (input)="filterNotes()"
              >
            </div>
            <button class="add-btn" (click)="openModal()" title="Create new note">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Note
            </button>
          </div>
        </div>
      </header>

      <main class="main-content">
        <div class="notes-container" *ngIf="!loading">
          <div class="notes-grid" *ngIf="filteredNotes.length > 0">
            <app-note-card 
              *ngFor="let note of filteredNotes" 
              [note]="note"
              (edit)="editNote($event)"
              (delete)="deleteNote($event)"
            ></app-note-card>
          </div>
          
          <div class="empty-state" *ngIf="filteredNotes.length === 0 && notes.length === 0">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
            </svg>
            <h3>No notes yet</h3>
            <p>Create your first note to get started</p>
            <button class="btn btn-primary" (click)="openModal()">
              Create Note
            </button>
          </div>

          <div class="empty-state" *ngIf="filteredNotes.length === 0 && notes.length > 0">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <h3>No notes found</h3>
            <p>Try adjusting your search terms</p>
          </div>
        </div>

        <div class="loading-state" *ngIf="loading">
          <div class="spinner"></div>
          <p>Loading notes...</p>
        </div>
      </main>

      <app-note-modal
        [isOpen]="isModalOpen"
        [note]="selectedNote"
        (close)="closeModal()"
        (save)="saveNote($event)"
      ></app-note-modal>

      <div class="toast" [class.show]="showToast" [class.error]="toastType === 'error'">
        {{ toastMessage }}
      </div>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  searchTerm = '';
  loading = false;
  isModalOpen = false;
  selectedNote: Note | null = null;
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private noteService: NoteService) {}

  ngOnInit() {
    this.loadNotes();
  }

  loadNotes() {
    this.loading = true;
    this.noteService.getAllNotes().subscribe({
      next: (notes) => {
        this.notes = notes;
        this.filterNotes();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching notes:', error);
        this.showToastMessage('Error loading notes', 'error');
        this.loading = false;
      }
    });
  }

  filterNotes() {
    if (!this.searchTerm.trim()) {
      this.filteredNotes = [...this.notes];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredNotes = this.notes.filter(note =>
        note.title.toLowerCase().includes(term) ||
        note.description.toLowerCase().includes(term)
      );
    }
  }

  openModal() {
    this.selectedNote = null;
    this.isModalOpen = true;
  }

  editNote(note: Note) {
    this.selectedNote = note;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedNote = null;
  }

  saveNote(noteData: Omit<Note, 'id'> | Note) {
    if ('id' in noteData) {
      // Update existing note
      this.noteService.updateNote(noteData as Note).subscribe({
        next: (updatedNote) => {
          const index = this.notes.findIndex(n => n.id === updatedNote.id);
          if (index !== -1) {
            this.notes[index] = updatedNote;
            this.filterNotes();
          }
          this.showToastMessage('Note updated successfully');
        },
        error: (error) => {
          console.error('Error updating note:', error);
          this.showToastMessage('Error updating note', 'error');
        }
      });
    } else {
      // Create new note
      this.noteService.addNote(noteData).subscribe({
        next: (newNote) => {
          this.notes.unshift(newNote);
          this.filterNotes();
          this.showToastMessage('Note created successfully');
        },
        error: (error) => {
          console.error('Error adding note:', error);
          this.showToastMessage('Error creating note', 'error');
        }
      });
    }
  }

  deleteNote(id: number) {
    this.noteService.deleteNote(id).subscribe({
      next: () => {
        this.notes = this.notes.filter(note => note.id !== id);
        this.filterNotes();
        this.showToastMessage('Note deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting note:', error);
        this.showToastMessage('Error deleting note', 'error');
      }
    });
  }

  private showToastMessage(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NoteService } from './services/note.service';
import { NoteCardComponent } from './components/note-card/note-card.component';
import { NoteModalComponent } from './components/note-modal/note-modal.component';
import { Note } from './models/note.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, NoteCardComponent, NoteModalComponent],
  template: `
    <div class="app-container">
      <!-- Header -->
      <header class="header">
        <div class="header-content">
          <div class="logo">
            <span class="logo-icon">📝</span>
            <h1>NotesApp</h1>
          </div>
          <button class="add-btn" (click)="openAddModal()">
            <span class="plus-icon">+</span>
            Add Note
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Search Bar -->
        <div class="search-container">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search notes..."
              [(ngModel)]="searchTerm"
              (input)="filterNotes()"
              class="search-input"
            >
          </div>
        </div>

        <!-- Notes Stats -->
        <div class="stats">
          <p class="stats-text">
            {{ filteredNotes.length }} {{ filteredNotes.length === 1 ? 'note' : 'notes' }}
            {{ searchTerm ? 'found' : 'total' }}
          </p>
        </div>

        <!-- Notes Grid -->
        <div class="notes-grid" *ngIf="filteredNotes.length > 0; else emptyState">
          <app-note-card
            *ngFor="let note of filteredNotes; trackBy: trackByNoteId"
            [note]="note"
            (edit)="openEditModal($event)"
            (delete)="deleteNote($event)"
          ></app-note-card>
        </div>

        <!-- Empty State -->
        <ng-template #emptyState>
          <div class="empty-state">
            <div class="empty-icon">{{ searchTerm ? '🔍' : '📝' }}</div>
            <h3>{{ searchTerm ? 'No notes found' : 'No notes yet' }}</h3>
            <p>{{ searchTerm ? 'Try adjusting your search terms' : 'Create your first note to get started' }}</p>
            <button *ngIf="!searchTerm" class="btn btn-primary" (click)="openAddModal()">
              Create First Note
            </button>
          </div>
        </ng-template>

        <!-- Loading State -->
        <div class="loading" *ngIf="loading">
          <div class="spinner"></div>
          <p>Loading notes...</p>
        </div>
      </main>

      <!-- Modal -->
      <app-note-modal
        *ngIf="showModal"
        [note]="selectedNote"
        (save)="saveNote($event)"
        (cancel)="closeModal()"
      ></app-note-modal>

      <!-- Toast Notifications -->
      <div class="toast" *ngIf="toastMessage" [class.show]="showToast">
        {{ toastMessage }}
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .logo-icon {
      font-size: 2rem;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 12px;
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .logo h1 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: #1f2937;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .add-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .add-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    .plus-icon {
      font-size: 1.25rem;
      font-weight: 300;
    }

    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .search-container {
      display: flex;
      justify-content: center;
      margin-bottom: 2rem;
    }

    .search-box {
      position: relative;
      width: 100%;
      max-width: 500px;
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.25rem;
      color: #6b7280;
    }

    .search-input {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      border: none;
      border-radius: 50px;
      font-size: 1rem;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .search-input:focus {
      outline: none;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
      transform: translateY(-2px);
    }

    .stats {
      text-align: center;
      margin-bottom: 2rem;
    }

    .stats-text {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.1rem;
      font-weight: 500;
      margin: 0;
    }

    .notes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      max-width: 500px;
      margin: 2rem auto;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.7;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #374151;
      margin: 0 0 0.5rem 0;
    }

    .empty-state p {
      color: #6b7280;
      margin: 0 0 2rem 0;
      font-size: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .loading {
      text-align: center;
      padding: 4rem 2rem;
      color: rgba(255, 255, 255, 0.9);
    }

    .spinner {
      width: 3rem;
      height: 3rem;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top: 3px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: #10b981;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s ease;
      z-index: 1000;
    }

    .toast.show {
      transform: translateY(0);
      opacity: 1;
    }

    @media (max-width: 768px) {
      .header-content {
        padding: 0 1rem;
        flex-direction: column;
        gap: 1rem;
      }

      .main-content {
        padding: 1rem;
      }

      .notes-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .logo h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  searchTerm: string = '';
  showModal: boolean = false;
  selectedNote: Note | null = null;
  loading: boolean = false;
  toastMessage: string = '';
  showToast: boolean = false;

  constructor(private noteService: NoteService) {}

  ngOnInit() {
    this.loadNotes();
  }

  loadNotes() {
    this.loading = true;
    this.noteService.getNotes().subscribe({
      next: (notes) => {
        this.notes = notes;
        this.filterNotes();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading notes:', error);
        this.loading = false;
        this.showToastMessage('Error loading notes');
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

  openAddModal() {
    this.selectedNote = null;
    this.showModal = true;
  }

  openEditModal(note: Note) {
    this.selectedNote = note;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedNote = null;
  }

  saveNote(noteData: Note) {
    if (this.selectedNote) {
      // Update existing note
      this.noteService.updateNote(noteData).subscribe({
        next: (updatedNote) => {
          const index = this.notes.findIndex(n => n.id === updatedNote.id);
          if (index !== -1) {
            this.notes[index] = updatedNote;
            this.filterNotes();
          }
          this.closeModal();
          this.showToastMessage('Note updated successfully');
        },
        error: (error) => {
          console.error('Error updating note:', error);
          this.showToastMessage('Error updating note');
        }
      });
    } else {
      // Add new note
      this.noteService.addNote(noteData).subscribe({
        next: (newNote) => {
          this.notes.push(newNote);
          this.filterNotes();
          this.closeModal();
          this.showToastMessage('Note created successfully');
        },
        error: (error) => {
          console.error('Error creating note:', error);
          this.showToastMessage('Error creating note');
        }
      });
    }
  }

  deleteNote(noteId: number) {
    this.noteService.deleteNote(noteId).subscribe({
      next: () => {
        this.notes = this.notes.filter(note => note.id !== noteId);
        this.filterNotes();
        this.showToastMessage('Note deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting note:', error);
        this.showToastMessage('Error deleting note');
      }
    });
  }

  trackByNoteId(index: number, note: Note): number {
    return note.id;
  }

  private showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
      setTimeout(() => {
        this.toastMessage = '';
      }, 300);
    }, 3000);
  }
}
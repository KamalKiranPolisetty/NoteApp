import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="note-card">
      <h3 class="note-title">{{ note.title }}</h3>
      <p class="note-content">{{ note.description }}</p>
      <div class="note-actions">
        <button class="btn btn-edit" (click)="onEdit()">
          <span class="icon">✏️</span>
          Edit
        </button>
        <button class="btn btn-delete" (click)="onDelete()">
          <span class="icon">🗑️</span>
          Delete
        </button>
      </div>
    </div>
  `,
  styles: [`
    .note-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      border: 1px solid #e5e7eb;
      height: 280px;
      display: flex;
      flex-direction: column;
    }

    .note-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .note-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 1rem 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .note-content {
      color: #6b7280;
      line-height: 1.6;
      margin: 0 0 1.5rem 0;
      flex-grow: 1;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 6;
      -webkit-box-orient: vertical;
    }

    .note-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: auto;
    }

    .btn {
      flex: 1;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-edit {
      background-color: #3b82f6;
      color: white;
    }

    .btn-edit:hover {
      background-color: #2563eb;
      transform: translateY(-1px);
    }

    .btn-delete {
      background-color: #ef4444;
      color: white;
    }

    .btn-delete:hover {
      background-color: #dc2626;
      transform: translateY(-1px);
    }

    .icon {
      font-size: 1rem;
    }
  `]
})
export class NoteCardComponent {
  @Input() note!: Note;
  @Output() edit = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<number>();

  onEdit() {
    this.edit.emit(this.note);
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this note?')) {
      this.delete.emit(this.note.id);
    }
  }
}
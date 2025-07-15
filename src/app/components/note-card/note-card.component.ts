import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="note-card" (click)="onEdit()">
      <div class="note-header">
        <h3 class="note-title">{{ note.title }}</h3>
        <button class="delete-btn" (click)="onDelete($event)" title="Delete note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3,6 5,6 21,6"></polyline>
            <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
      <p class="note-description">{{ note.description }}</p>
      <div class="note-date" *ngIf="note.createdAt">
        {{ formatDate(note.createdAt) }}
      </div>
    </div>
  `,
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent {
  @Input() note!: Note;
  @Output() edit = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<number>();

  onEdit() {
    this.edit.emit(this.note);
  }

  onDelete(event: Event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
      this.delete.emit(this.note.id);
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="onClose()" *ngIf="isOpen">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ isEditing ? 'Edit Note' : 'Create New Note' }}</h2>
          <button class="close-btn" (click)="onClose()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <form (ngSubmit)="onSubmit()" #noteForm="ngForm">
          <div class="form-group">
            <label for="title">Title</label>
            <input 
              type="text" 
              id="title" 
              name="title"
              [(ngModel)]="noteData.title" 
              required
              #titleInput="ngModel"
              placeholder="Enter note title..."
            >
            <div class="error-message" *ngIf="titleInput.invalid && titleInput.touched">
              Title is required
            </div>
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description" 
              name="description"
              [(ngModel)]="noteData.description" 
              required
              #descriptionInput="ngModel"
              rows="6"
              placeholder="Enter note description..."
            ></textarea>
            <div class="error-message" *ngIf="descriptionInput.invalid && descriptionInput.touched">
              Description is required
            </div>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" (click)="onClose()">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="noteForm.invalid">
              {{ isEditing ? 'Update' : 'Create' }} Note
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./note-modal.component.scss']
})
export class NoteModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() note: Note | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Omit<Note, 'id'> | Note>();

  noteData: Omit<Note, 'id'> = {
    title: '',
    description: ''
  };

  get isEditing(): boolean {
    return this.note !== null;
  }

  ngOnInit() {
    if (this.note) {
      this.noteData = {
        title: this.note.title,
        description: this.note.description
      };
    }
  }

  onClose() {
    this.close.emit();
    this.resetForm();
  }

  onSubmit() {
    if (this.isEditing && this.note) {
      this.save.emit({
        ...this.note,
        ...this.noteData
      });
    } else {
      this.save.emit(this.noteData);
    }
    this.onClose();
  }

  private resetForm() {
    this.noteData = {
      title: '',
      description: ''
    };
  }
}
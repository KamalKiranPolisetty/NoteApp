import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="onCancel()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ isEdit ? 'Edit Note' : 'Add New Note' }}</h2>
          <button class="close-btn" (click)="onCancel()">×</button>
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
              maxlength="100"
              placeholder="Enter note title..."
              #titleInput="ngModel"
            >
            <div class="error" *ngIf="titleInput.invalid && titleInput.touched">
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
              rows="6"
              placeholder="Enter note description..."
              #descInput="ngModel"
            ></textarea>
            <div class="error" *ngIf="descInput.invalid && descInput.touched">
              Description is required
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-cancel" (click)="onCancel()">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="noteForm.invalid">
              {{ isEdit ? 'Update' : 'Create' }} Note
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }

    .modal-content {
      background: white;
      border-radius: 16px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      animation: modalSlideIn 0.3s ease-out;
    }

    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem 2rem 1rem 2rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2rem;
      color: #6b7280;
      cursor: pointer;
      padding: 0;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background-color: #f3f4f6;
      color: #374151;
    }

    form {
      padding: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
    }

    input, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.2s ease;
      box-sizing: border-box;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    textarea {
      resize: vertical;
      min-height: 120px;
    }

    .error {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 100px;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-cancel {
      background-color: #f3f4f6;
      color: #374151;
    }

    .btn-cancel:hover:not(:disabled) {
      background-color: #e5e7eb;
    }

    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #2563eb;
      transform: translateY(-1px);
    }
  `]
})
export class NoteModalComponent implements OnInit {
  @Input() note: Note | null = null;
  @Output() save = new EventEmitter<Note>();
  @Output() cancel = new EventEmitter<void>();

  noteData: Note = {
    id: 0,
    title: '',
    description: ''
  };

  get isEdit(): boolean {
    return this.note !== null;
  }

  ngOnInit() {
    if (this.note) {
      this.noteData = { ...this.note };
    } else {
      this.noteData = {
        id: 0,
        title: '',
        description: ''
      };
    }
  }

  onSubmit() {
    if (this.noteData.title.trim() && this.noteData.description.trim()) {
      this.save.emit(this.noteData);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
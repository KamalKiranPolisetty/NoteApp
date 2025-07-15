import { Component,input,output,signal } from '@angular/core';
import { Note } from '../../model/Note.model';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-note-modal',
  imports: [FormsModule,CommonModule],
  templateUrl: './note-modal.html',
  styleUrl: './note-modal.scss'
})
export class NoteModal implements OnInit {
   note = input<Note | null>();

   submitNote = output<Note>();
   cancel = output<void>();

   title = signal('');
  description = signal('');

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (this.note()) {
      this.title.set(this.note()?.title || '');
      this.description.set(this.note()?.description || '');
    } else {
      this.title.set('');
      this.description.set('');
    }
  }


    onSubmit() {
       const submittedNote: Note = {
        id : this.note()?.id ?? 0,
        title: this.title(),
        description: this.description(),
       }
        this.submitNote.emit(submittedNote);
    }

    onCancel() {
        this.cancel.emit();
    }
}

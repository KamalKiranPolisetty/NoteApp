import { Component, inject } from '@angular/core';
import { NotesComponent } from '../notes-component/notes-component';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.scss'
})
export class SideBar {
  
  onAddNote() {
    // We'll emit an event to the parent component
    // For now, we'll use a simple approach
    const event = new CustomEvent('addNote');
    document.dispatchEvent(event);
  }
}
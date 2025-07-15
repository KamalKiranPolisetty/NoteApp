import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotesComponent } from './components/notes-component/notes-component';
import { SideBar } from './components/side-bar/side-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotesComponent, SideBar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected title = 'NoteApp';

  ngOnInit() {
    // Listen for add note events from sidebar
    document.addEventListener('addNote', () => {
      // Find the notes component and trigger add note
      const notesComponent = document.querySelector('app-notes-component');
      if (notesComponent) {
        // We'll need to implement this communication properly
        // For now, this is a placeholder
      }
    });
  }
}
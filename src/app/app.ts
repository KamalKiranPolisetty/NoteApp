import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotesComponent } from './components/notes-component/notes-component';
import { SideBar } from './components/side-bar/side-bar';
import { NoteCard } from './components/note-card/note-card';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotesComponent,SideBar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'NoteApp';
}

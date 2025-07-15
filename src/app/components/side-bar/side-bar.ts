import { Component } from '@angular/core';
import { NoteModal } from "../note-modal/note-modal";

@Component({
  selector: 'app-side-bar',
  imports: [NoteModal],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.scss'
})
export class SideBar {

}

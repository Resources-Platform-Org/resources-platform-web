import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-admin-files',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './files.component.html',
  styleUrl: './files.component.css'
})
export class FilesComponent {}

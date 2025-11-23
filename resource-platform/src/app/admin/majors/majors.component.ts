import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-admin-majors',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './majors.component.html',
  styleUrl: './majors.component.css'
})
export class MajorsComponent {}

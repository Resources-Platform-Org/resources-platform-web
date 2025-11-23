import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-admin-universities',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './universities.component.html',
  styleUrl: './universities.component.css'
})
export class UniversitiesComponent {}

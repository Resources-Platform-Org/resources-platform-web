import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TokenStorageService } from '../../core/auth/token-storage.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private tokenStorage = inject(TokenStorageService);

  get isAdmin(): boolean {
    return !!this.tokenStorage.getToken() && this.tokenStorage.getRole() === 'Admin';
  }
}

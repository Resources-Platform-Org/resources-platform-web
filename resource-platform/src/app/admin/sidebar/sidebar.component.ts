import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TokenStorageService } from '../../core/auth/token-storage.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private router = inject(Router);
  private tokenStorage = inject(TokenStorageService);

  logout(): void {
    this.tokenStorage.signOut();
    this.router.navigate(['/home']);
  }
}

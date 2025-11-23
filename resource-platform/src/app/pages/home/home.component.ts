import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateTo(path: string, queryParams?: any) {
    this.router.navigate([path], { queryParams });
  }
}

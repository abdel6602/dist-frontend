import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(private router: Router) {}

  logout() {
    // Implement logout logic here (e.g., clearing authentication tokens)
    this.router.navigate(['/login']);
  }
}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Navbar du haut -->
    <nav
      class="flex justify-between items-center sticky top-0 z-50 w-full px-6 py-4 bg-gradient-to-r from-blue-300 via-pink-300 to-purple-300 shadow-lg shadow-purple-500/30 text-white"
    >
      <div class="flex items-center gap-3 text-2xl font-bold">
        <img
          src="images/logoDisney.png"
          alt="Logo Disney"
          class="w-48 h-auto"
        />
        <a routerLink="/" class="hover:text-yellow-200 transition taille">
          RainbowDB
        </a>
      </div>

      <div class="flex gap-6 items-center text-lg">
        <a
          routerLink="/characters"
          class="hover:scale-105 hover:text-yellow-200 transition duration-300"
          >Personnages</a
        >
        <a
          routerLink="/articles"
          class="hover:scale-105 hover:text-yellow-200 transition duration-300"
          >Articles</a
        >

        @if (authService.isLoggedIn()) {
        <button
          (click)="logout()"
          class="hover:scale-105 hover:text-yellow-200 transition duration-300"
        >
          Déconnexion
        </button>
        } @else {
        <a
          routerLink="/login"
          class="hover:scale-105 hover:text-yellow-200 transition duration-300"
          >Connexion</a
        >
        }
      </div>
    </nav>

  `,
  styles: [
    `
      a,
      button {
        font-family: 'Waltograph', sans-serif;
        font-size: 2rem;
      }

      .taille {
        font-size: 2.8rem;
      }
    `,
  ],
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}

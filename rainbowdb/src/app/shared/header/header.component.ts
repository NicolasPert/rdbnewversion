import { Component } from '@angular/core';
import { RouterLink} from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: ` <nav>
    <a routerLink="/">Accueil</a>
    <a routerLink="/characters">Personnages</a>
    <a routerLink="/articles">Articles</a>

    @if (authService.isLoggedIn()) {
    <a (click)="authService.logout()">Déconnexion</a>
    } @else {
    <a routerLink="/login">Connexion</a>
    }
    
  </nav>`,
  styles: [
    `
      nav {
        display: flex;
        gap: 20px; /* Espacement entre les liens */
        padding: 10px;
      }

      a {
        text-decoration: none;
        color: #0ceaea;
        padding: 10px;
        transition: color 0.3s;
      }

      a:hover {
        color: blue;
      }

      a.active {
        font-weight: bold;
        color: blue; /* Style du lien actif */
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

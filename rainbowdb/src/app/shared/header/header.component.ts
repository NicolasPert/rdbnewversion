import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav>
  <a routerLink="/" routerLinkActive="active">Accueil</a>
  <a routerLink="/characters" routerLinkActive="active">Personnages</a>
  <a routerLink="/articles" routerLinkActive="active">Articles</a>
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
        color: black;
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
export class HeaderComponent {}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer
      class="fixed bottom-0 left-64 h-16 w-[calc(100%-16rem)] bg-transparent flex items-center pl-8 text-blue-400 font-waltograph z-40"
    >
      <nav class="flex gap-6">
        <a routerLink="/mentions" class="hover:underline">Mentions légales</a>
        <a routerLink="/contact" class="hover:underline">Contact</a>
        <a routerLink="/about" class="hover:underline">A propos</a>
      </nav>
    </footer>
  `,
  styles: [
    `
      .font-waltograph {
        font-family: 'Waltograph', sans-serif;
        font-size: 1.8rem;
      }
    `,
  ],
})
export class FooterComponent {}

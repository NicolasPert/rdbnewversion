import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="relative">
    <a
      [routerLink]="['/add-character']"
      class="absolute [bottom:-4rem] [right-0rem] bg-green-500 text-white w-12 h-12 flex items-center justify-center rounded-full text-xl shadow-lg hover:bg-green-600 transition"
      title="Ajouter un personnage"
    >
      A
    </a>
</div>
  `,
  styles: [``],
})
export class CharactersComponent {}

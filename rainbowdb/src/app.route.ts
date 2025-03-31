import { Routes } from '@angular/router';
import { HomeComponent } from './app/pages/home/home.component';
import { CharactersComponent } from './app/pages/characters/characters.component';
import { ArticlesComponent } from './app/pages/articles/articles.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'characters', component: CharactersComponent },
  { path: 'articles', component: ArticlesComponent },
  { path: '**', redirectTo: '' }, // Redirection si la route est inconnue
];

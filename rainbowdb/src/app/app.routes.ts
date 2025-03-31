import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CharactersComponent } from './pages/characters/characters.component';
import { ArticlesComponent } from './pages/articles/articles.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Page d'accueil
  { path: 'characters', component: CharactersComponent }, // Page des personnages
  { path: 'articles', component: ArticlesComponent }, // Page des articles
  { path: '**', redirectTo: '' }, // Redirection si la route est inconnue
];

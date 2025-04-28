import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CharactersComponent } from './pages/characters/characters.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ChatWidgetComponent } from './shared/chat/chat-widget/chat-widget.component';
import { AjouterCharacterComponent } from './pages/add-character/add-character.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Page d'accueil
  { path: 'characters', component: CharactersComponent }, // Page des personnages
  {path: 'add-character', component: AjouterCharacterComponent}, // Page d'ajout de personnage
  { path: 'articles', component: ArticlesComponent }, // Page des articles
  { path: 'login', component: LoginComponent }, // Page de connexion
  { path: 'register', component: RegisterComponent }, // Page d'inscription
  {path: 'chatwidget', component: ChatWidgetComponent }, // Page de chat 
  { path: '**', redirectTo: '' }, // Redirection si la route est inconnue
];

import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, RouterLink } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ChatWidgetComponent } from './shared/chat/chat-widget/chat-widget.component';
// import { LoginComponent } from './pages/login/login.component';
import { AuthService } from './shared/services/auth.service';
import { WeatherComponent } from './shared/weather/weather.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ChatWidgetComponent,
    WeatherComponent,
    RouterLink
  ],
  template: `
    <app-header></app-header>

    <div class="flex min-h-screen">
      <!-- Sidebar à gauche -->
      <aside
        class="w-64 h-screen sticky top-0 bg-gradient-to-b from-blue-300 via-pink-300 to-purple-300 p-4 text-white shadow-lg shadow-purple-500/30"
      >
        <div class="relative">
          <a
            [routerLink]="['/add-character']"
            class="absolute [bottom:-4rem] [right-0rem] bg-green-500 text-white w-12 h-12 flex items-center justify-center rounded-full text-xl shadow-lg hover:bg-green-600 transition"
            title="Ajouter un personnage"
          >
            A
          </a>
        </div>
        <app-weather class="text-black"></app-weather>
      </aside>

      <!-- Zone principale -->
      <div
        class="flex-1 flex justify-center p-6 bg-gradient-to-b from-blue-100 to-white"
      >
        <div class="w-full max-w-5xl">
          <router-outlet></router-outlet>
        </div>
      </div>

      <!-- Chat widget si connecté -->
      @if (isConnected) {
      <app-chat-widget />
      }
    </div>

    <app-footer></app-footer>
  `,
  styles: [``],
})
export class AppComponent {
  isConnected = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isConnected = this.authService.isLoggedInSignal();
  }
  title = 'rainbowdb';
}

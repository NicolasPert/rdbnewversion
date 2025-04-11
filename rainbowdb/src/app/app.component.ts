import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ChatWidgetComponent } from './shared/chat/chat-widget/chat-widget.component';
// import { LoginComponent } from './pages/login/login.component';
import { AuthService } from './shared/services/auth.service';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ChatWidgetComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isConnected = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isConnected = this.authService.isLoggedIn();
  }
  title = 'rainbowdb';
}

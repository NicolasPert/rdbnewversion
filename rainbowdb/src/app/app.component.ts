import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ChatWidgetComponent } from './shared/chat/chat-widget/chat-widget.component';
import { LoginComponent } from './pages/login/login.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ChatWidgetComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rainbowdb';
}

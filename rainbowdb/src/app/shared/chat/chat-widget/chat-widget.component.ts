import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat-widget',
  imports: [],
  template: `<!-- Bouton flottant -->
    @if (authService.isLoggedIn()) {
    <button
      (click)="toggleChat()"
      class="fixed bottom-6 right-6 w-16 h-16 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 flex items-center justify-center z-50 transition-transform duration-300"
    >
      💬</button
    >}

    <!-- Fenêtre de chat -->
    <div
      class="fixed bottom-24 right-6 w-96 max-h-[70vh] bg-white rounded-lg shadow-xl border border-gray-300 flex flex-col transition-all duration-500 overflow-hidden z-40"
      [class.translate-y-full]="!chatOpen"
      [class.opacity-0]="!chatOpen"
      [class.opacity-100]="chatOpen"
    >
      <div class="bg-blue-500 text-white px-4 py-2 font-bold">
        Chat RainbowDB
      </div>
      <div class="flex-1 p-4 overflow-y-auto">
        <!-- Contenu du chat ici -->
      </div>
    </div> `,
  styles: [``],
})
export class ChatWidgetComponent {
  isConnected = false;
  chatOpen = false;

  constructor(public authService: AuthService) {}

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }
}

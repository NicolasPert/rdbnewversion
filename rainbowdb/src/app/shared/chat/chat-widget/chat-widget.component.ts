import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [FormsModule],
  template: `
    <!-- Bouton flottant -->
    @if (authService.isLoggedInSignal()) {
    <button
      (click)="toggleChat()"
      class="fixed bottom-6 right-6 w-16 h-16 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600
                 flex items-center justify-center z-50 transition-transform duration-300"
    >
      💬
    </button>
    }

    <!-- Fenêtre de chat -->
    <div
      class="fixed bottom-24 right-6 w-96 max-h-[70vh] bg-white rounded-lg shadow-xl border border-gray-300
             flex flex-col transition-all duration-500 overflow-hidden z-40"
      [class.translate-y-full]="!chatOpen"
      [class.opacity-0]="!chatOpen"
      [class.opacity-100]="chatOpen"
    >
      <div class="bg-blue-500 text-white px-4 py-2 font-bold">
        Chat RainbowDB
      </div>

      <!-- Liste des utilisateurs -->
      <div class="p-4 bg-gray-100 max-h-40 overflow-y-auto">
        @if (users.length > 0) {
        <ul>
          @for (user of users; track user.username) {
          <li
            (click)="startChat(user)"
            class="cursor-pointer p-2 hover:bg-gray-200"
          >
            {{ user.username }}
          </li>
          }
        </ul>
        } @else {
        <p class="text-center text-gray-500">Aucun utilisateur disponible</p>
        }
      </div>

      <!-- Messages avec style Messenger -->
      <div class="flex-1 px-4 py-2 overflow-y-auto space-y-2" #messageContainer>
        @if (chatService.isConnected()) { @for (message of
        chatService.messagesSignal(); track message.timestamp) {
        <div
          class="flex"
          [class.justify-end]="message.username === chatService.username"
          [class.justify-start]="message.username !== chatService.username"
        >
          <div
            class="max-w-xs px-4 py-2 rounded-xl shadow text-sm"
            [class.bg-blue-500]="message.username === chatService.username"
            [class.text-white]="message.username === chatService.username"
            [class.bg-gray-200]="message.username !== chatService.username"
            [class.text-black]="message.username !== chatService.username"
          >
            <p>{{ message.content }}</p>
            <small class="block mt-1 text-xs text-right opacity-70">
              {{ message.username }}
            </small>
          </div>
        </div>
        } } @else {
        <p class="text-center text-gray-500 mt-4">Connecting…</p>
        }
      </div>

      <!-- Formulaire -->
      @if (chatService.isConnected()) {
      <form
        (submit)="sendMessage()"
        class="p-4 border-t border-gray-300 flex gap-2"
      >
        <input
          type="text"
          [(ngModel)]="newMessage"
          name="message"
          class="flex-1 border border-gray-300 rounded px-3 py-2"
          placeholder="Écris un message…"
        />
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Envoyer
        </button>
      </form>
      }
    </div>
  `,
})
export class ChatWidgetComponent implements OnInit {
  chatOpen = false;
  newMessage = '';
  users: User[] = [];

  constructor(
    public authService: AuthService,
    public chatService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getAllUsers().subscribe((users) => {
      this.users = users;
    });
  }

  toggleChat() {
    this.chatOpen = !this.chatOpen;

    if (this.chatOpen && this.users.length === 0) {
      this.userService.getAllUsers().subscribe((users) => {
        this.users = users.filter(
          (u) => u.username !== this.authService.getUsername()
        );
      });
    }
  }

  startChat(user: User) {
    this.chatService.connectWithUser(user.username);
  }

  sendMessage() {
    if (!this.chatService.isConnected()) {
      console.warn('❌ WebSocket pas encore prêt !');
      return;
    }

    if (this.newMessage.trim()) {
      this.chatService.sendMessage(
        this.newMessage.trim(),
      );
      this.newMessage = '';
    }
  }
}

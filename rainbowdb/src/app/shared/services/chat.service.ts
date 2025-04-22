import { Injectable, signal, WritableSignal } from '@angular/core';
import { User } from '../../models/user';
import { HttpClient } from '@angular/common/http';

export interface ChatMessage {
  room_id: string;
  content: string;
  type: string;
  timestamp: number;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private ws: WebSocket | null = null;
  private currentUserId: number | null = null; // pour stocker l'ID de l'utilisateur
  private currentRoomId: string | null = null; // pour stocker le room_id
  public user: User | null = null;
  public users: User[] = [];
  public username: string | null = localStorage.getItem('username');

  constructor(private http: HttpClient) {} // Initialisation du username à partir de localStorage

  messagesSignal: WritableSignal<ChatMessage[]> = signal<ChatMessage[]>([]);
  isConnected = signal<boolean>(false);

  // Méthode pour récupérer tous les utilisateurs en excluant l'utilisateur connecté
  getUsers() {
    this.http.get<User[]>('/api/users/').subscribe((users) => {
      const currentUsername = localStorage.getItem('username');

      // Filtrer les utilisateurs pour exclure l'utilisateur connecté
      const filteredUsers = users.filter(
        (user) => user.username !== currentUsername
      );

      // Remise à jour de la liste des utilisateurs
      this.users = [...filteredUsers]; // Ici on remplace le tableau complet pour éviter des doublons
    });
  }

  connectWithUser(targetUsername: string) {
    const token = localStorage.getItem('auth_token');
    const currentUser = localStorage.getItem('username');

    if (!token || !currentUser || !targetUsername) {
      console.error('Missing token, current user or target username');
      return;
    }

    // Fermer la connexion précédente
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected.set(false);
    }

    this.username = currentUser;
    this.currentRoomId = [currentUser, targetUsername].sort().join('-');

    this.ws = new WebSocket(
      `ws://localhost:8001/ws/${this.currentRoomId}?token=${token}`
    );

    this.ws.onopen = () => {
      console.log('✅ WebSocket connecté');
      this.isConnected.set(true);
    };

    // Évite d'empiler les messages : on remet un nouveau handler propre à chaque connexion
    this.ws.onmessage = (evt) => {
      const payload = JSON.parse(evt.data);
      if (payload.data) {
        const msg: ChatMessage = {
          ...payload.data,
          timestamp: Date.now(),
          username: payload.data.username ?? currentUser,
          room_id: this.currentRoomId,
          status: payload.data.username === this.username ? 'sent' : 'received',
        };

        // Vérifie si le message existe déjà (évite duplication)
        const messages = this.messagesSignal();
        const isDuplicate = messages.some(
          (existingMsg) =>
            existingMsg.timestamp === msg.timestamp &&
            existingMsg.content === msg.content &&
            existingMsg.username === msg.username
        );

        if (!isDuplicate) {
          this.messagesSignal.update((list) => [...list, msg]);
        }
      }
    };
  }

  sendMessage(content: string) {
    if (!this.ws || !this.isConnected() || !this.currentRoomId) {
      console.error(
        'Cannot send message: WebSocket not connected or missing room info.'
      );
      return;
    }

    const message: ChatMessage = {
      content,
      username: this.username ?? 'unknown',
      type: 'chat',
      timestamp: Date.now(),
      room_id: this.currentRoomId,
    };

    this.ws.send(JSON.stringify(message));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected.set(false);
    }
  }
}
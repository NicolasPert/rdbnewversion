import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth';
  isLoggedInSignal = signal<boolean>(!!localStorage.getItem('auth_token'));

  constructor(private http: HttpClient) {}

  register(data: {
    username: string;
    email: string;
    password: string;
  }): Observable<Object> {
    console.log("Données envoyées à l'API : ", data);
    return this.http.post(`${this.apiUrl}/register/`, data);
  }

  login(credentials: {
    username: string;
    password: string;
  }): Observable<Object> {
    return this.http
      .post<{
        access: string;
        refresh: string;
        user: { id: number; username: string; email: string };
      }>(`${this.apiUrl}/login/`, credentials)
      .pipe(
        tap((res) => {
          localStorage.setItem('auth_token', res.access);
          localStorage.setItem('refresh_token', res.refresh);
          localStorage.setItem('username', res.user.username); // ✅ user.username de la réponse
          localStorage.setItem('user_id', res.user.id.toString());
          localStorage.setItem('email', res.user.email);
          this.isLoggedInSignal.set(true);
        })
      );
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    localStorage.removeItem('email');
    this.isLoggedInSignal.set(false);
  }

  getToken(): string | null {
    const token = localStorage.getItem('auth_token');
    // console.log('Token JWT:', token);
    return localStorage.getItem('auth_token');
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth';

  constructor(private http: HttpClient) {}

  register(data: {
    username: string;
    email: string;
    password: string;
  }): Observable<Object> {
    console.log("Données envoyées à l'API : ", data);
    return this.http.post(`${this.apiUrl}/register/`, data);
  }

  login(credentials: { username: string; password: string }): Observable<Object> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/login/`, credentials)
      .pipe(tap((res) => localStorage.setItem('auth_token', res.token)));
  }

  logout() {
    localStorage.removeItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

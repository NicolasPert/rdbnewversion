import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Color } from '../../models/color';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  constructor(private http: HttpClient) {}

  setHeaders() {
    const jwtToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
    });
    return headers;
  }

  getColors(): Observable<Color[]> {
    return this.http.get<Color[]>(`http://localhost:8000/api/colors/`);
  }

  updateColors(colorId: number, color: Color): Observable<Color> {
    const headers = this.setHeaders();
    return this.http.patch<Color>(
      `http://localhost:8000/api/characters/${colorId}`,
      color,
      { headers }
    );
  }
}

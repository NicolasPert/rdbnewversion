import { Injectable } from '@angular/core';
import { Picture } from '../../models/picture';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PicturesService {
  picture: Picture[] = [];
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  setHeaders() {
    const jwtToken = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
    });
    return headers;
  }

  getPicture() {
    return this.http.get(`http://localhost:8000/api/pictures/`, {
      responseType: 'blob',
    });
  }

  getPictureById(id: number) {
    return this.http.get<Picture>(`${this.apiUrl}/pictures/${id}/`);
  }

  postPicture(formData: FormData) {
    return this.http.post<Picture>(
      `http://localhost:8000/api/pictures/`,
      formData
    );
  }

  deletePicture(id: number) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('access_token'),
    });
    return this.http.delete(`http://localhost:8000/api/pictures/${id}`, {
      headers: headers,
    });
  }
}

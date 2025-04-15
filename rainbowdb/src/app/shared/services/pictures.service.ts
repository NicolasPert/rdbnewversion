import { Injectable } from '@angular/core';
import { Picture } from '../../models/picture';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PicturesService {
  picture: Picture[] = [];

  constructor(private http: HttpClient) {}

  getPicture() {
    return this.http.get(`http://localhost:8000/api/pictures/`, {
      responseType: 'blob',
    });
  }

  getPictureById(id: number) {
    return this.http.get(`http://localhost:8000/api/pictures/${id}`, {
      responseType: 'blob',
    });
  }

  postPicture(formData: FormData) {
    return this.http.post(`http://localhost:8000/api/pictures/`, formData);
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

import { Injectable } from '@angular/core';
import { Univer } from '../../models/univer';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UniversService {
  
  constructor(private http: HttpClient) {}
  

  getUnivers(): Observable<Univer[]> {

    return this.http.get<Univer[]>(`http://localhost:8000/api/univers`);
  }
}

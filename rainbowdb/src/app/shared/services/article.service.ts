import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article } from '../../models/article';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private apiUrl = 'http://localhost:8000/api/articles';

  constructor(private http: HttpClient) {}


    getArticles(): Observable<Article[]> {
      return this.http.get<Article[]>(this.apiUrl);
    }
}

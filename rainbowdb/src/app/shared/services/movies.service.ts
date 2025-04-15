import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateMovies } from '../../models/createMovies';
import { Movie } from '../../models/movie';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  constructor(private http: HttpClient) {}

  setHeaders() {
    const jwtToken = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
    });
    return headers;
  }

  createMovies(movies: CreateMovies): Observable<Movie> {
    const headers = this.setHeaders();
    return this.http.post<Movie>(`http://localhost:8000/api/movies`, movies, {
      headers,
    });
  }

  updateMovies(movieId: number, movies: CreateMovies): Observable<Movie> {
    const headers = this.setHeaders();
    return this.http.patch<Movie>(
      `http://localhost:8000/api/characters/${movieId}`,
      movies,
      { headers }
    );
  }

  getMovie(): Observable<Movie> {
    return this.http.get<Movie>(`http://localhost:8000/api/movies`);
  }

  getMovieIdByName(movieName: string): Observable<number> {
    return this.http.get<number>(
      `http://localhost:8000/api/movies/id?name=${movieName}`
    );
  }
  deleteMovie(movieId: string): Observable<Movie> {
    // recup le token dans le sessionstorage
    const headers = this.setHeaders();
    return this.http.delete<Movie>(
      `http://localhost:8000/api/movies/${movieId}`,
      {
        headers,
      }
    );
  }
}

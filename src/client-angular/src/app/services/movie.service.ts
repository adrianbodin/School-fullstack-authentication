import {inject, Injectable} from '@angular/core';
import {environment} from "../../environments/environment.development";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {IMovie} from "../interfaces/IMovie";
import {IUpdateMovieDto} from "../interfaces/Dtos/iupdate-movie-dto";
import {IAddMovieDto} from "../interfaces/Dtos/iadd-movie-dto";

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  http = inject(HttpClient);

  apiUrl = environment.apiUrl;
  constructor() {}
  //^^^^^^^^^^Dependencies^^^^^^^^^^^^^^


  getAllMovies() : Observable<IMovie[]>{
    return this.http.get<IMovie[]>(`${this.apiUrl}/api/movie`)
  }

  getMovieById(id : number) : Observable<IMovie>{
    return this.http.get<IMovie>(`${this.apiUrl}/api/movie/${id}`)
  }

  addMovie(movie : IAddMovieDto) : Observable<IMovie> {
    const token = localStorage.getItem('token');

    const movieData = {
      title: movie.title,
      releaseYear: movie.releaseYear
    };

    return this.http.post<IMovie>(`${this.apiUrl}/api/movie`, movieData,
      { headers: { 'Authorization': `Bearer ${token}` } }
    )
  }

  deleteMovie(movieId : number) : Observable<HttpResponse<void>>{
    const token = localStorage.getItem('token');


    return this.http.delete<void>(`${this.apiUrl}/api/movie/${movieId}`, {
      headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`},
      observe: 'response'
    });
  }


  updateMovie(movie : IUpdateMovieDto) : Observable<IMovie> {
    const token = localStorage.getItem('token');

    const movieData = {
      title: movie.title,
      releaseYear: movie.releaseYear
    };

    return this.http.put<IMovie>(`${this.apiUrl}/api/movie/${movie.id}`, movieData,
      { headers: { 'Authorization': `Bearer ${token}` } }
      )
  }

}

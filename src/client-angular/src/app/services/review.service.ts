import {inject, Injectable} from '@angular/core';
import {environment} from "../../environments/environment.development";
import {Observable} from "rxjs";
import {IMovie} from "../interfaces/IMovie";
import {IAddMovieDto} from "../interfaces/Dtos/iadd-movie-dto";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {IUpdateMovieDto} from "../interfaces/Dtos/iupdate-movie-dto";
import {IAddReviewDto} from "../interfaces/Dtos/iadd-review-dto";
import {IReview} from "../interfaces/IReview";
import {IUpdateReviewDto} from "../interfaces/Dtos/iupdate-review-dto";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  http = inject(HttpClient);

  apiUrl = environment.apiUrl;

  constructor() { }

  getAllMovies() : Observable<IMovie[]>{
    return this.http.get<IMovie[]>(`${this.apiUrl}/api/movie`)
  }

  getMovieById(id : number) : Observable<IMovie>{
    return this.http.get<IMovie>(`${this.apiUrl}/api/movie/${id}`)
  }

  addReview(review : IAddReviewDto) : Observable<IReview> {
    const token = localStorage.getItem('token');

    return this.http.post<IReview>(`${this.apiUrl}/api/review`, review,
      { headers: { 'Authorization': `Bearer ${token}` } }
    )
  }

  deleteReview(reviewId : number) : Observable<HttpResponse<void>>{
    const token = localStorage.getItem('token');

    return this.http.delete<void>(`${this.apiUrl}/api/review/${reviewId}`, {
      headers: {'Authorization': `Bearer ${token}`},
      observe: 'response'
    });
  }

  updateReview(review : IUpdateReviewDto) : Observable<IReview> {
    const token = localStorage.getItem('token');

    const reviewData = {
      grade: review.grade,
      comment: review.comment
    };

    return this.http.put<IReview>(`${this.apiUrl}/api/review/${review.id}`, reviewData,
      { headers: { 'Authorization': `Bearer ${token}` } }
    )
  }
}

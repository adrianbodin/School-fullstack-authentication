import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MovieService} from "../../services/movie.service";
import {Observable} from "rxjs";
import {IMovie} from "../../interfaces/IMovie";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardHeader} from "@angular/material/card";
import {AuthService} from "../../services/auth.service";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {ReviewService} from "../../services/review.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {IAddReviewDto} from "../../interfaces/Dtos/iadd-review-dto";
import {IAddMovieDto} from "../../interfaces/Dtos/iadd-movie-dto";
import {IReview} from "../../interfaces/IReview";
import {IUpdateReviewDto} from "../../interfaces/Dtos/iupdate-review-dto";

@Component({
  selector: 'app-moviedetails',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgForOf,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardFooter,
    MatButton,
    MatIcon,
    MatCardActions,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule
  ],
  templateUrl: './moviedetails.component.html',
  styleUrl: './moviedetails.component.css'
})
export class MoviedetailsComponent implements OnInit {

  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  reviewService = inject(ReviewService);
  movieService = inject(MovieService);
  snackBar = inject(MatSnackBar);
  fb = inject(FormBuilder);

  //^^^^^^^^^^^Dependencies^^^^^^^^^^^^^^

  //used to hold the value from the route, the movie id
  movieId: number = 1;

  showHideEditForm : boolean = false;

  //hold the current review being edited
  editingReview: IReview | null = null;

  //sets this stream from the getmoviebyid, this is then used in the template
  movie$? : Observable<IMovie>;

  //runs when the component is initialized
  ngOnInit() {
    //converts this to a number, because it is a string by default
    this.movieId = Number(this.route.snapshot.paramMap.get('id')) || 1;
    this.movie$ = this.movieService.getMovieById(this.movieId);
  }

  //Form for the add review
  addReviewForm = this.fb.group({
    grade: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.maxLength(100)]]
  });

  //Form to edit a review
  editReviewForm = this.fb.group({
    grade: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.maxLength(100)]]
  });

  //When submitting the edit form
  submitEditForm(){
    if(this.editReviewForm.valid){
      let reviewDto: IUpdateReviewDto = {
        id: this.editingReview?.id ?? 0,
        grade: Number(this.editReviewForm.get('grade')?.value ?? 1),
        comment: this.editReviewForm.get('comment')?.value ?? "",
      }

      //clears the form
      this.editReviewForm.reset({
        grade: '',
        comment: ''
      });

      this.showEditForm();

      //subscribes to the add review method, which means that it is being executed
      this.reviewService.updateReview(reviewDto)
        .subscribe(
          //if the request succeeds
          () => this.refreshMovieWithMessage('Successfully updated the review!'),
          //if the request dont succeed
          () => this.refreshMovieWithMessage('There was an error editing the review')
        )
    }
  }

  //When the form is submitted
  submitReviewForm(){
    if(this.addReviewForm.valid){
      //sets all of the values to a object of the correct type
      let reviewDto: IAddReviewDto = {
        grade: Number(this.addReviewForm.get('grade')?.value ?? 1),
        comment: this.addReviewForm.get('comment')?.value ?? "",
        movieId: this.movieId
      }

      //clears the form
      this.addReviewForm.reset({
        grade: '',
        comment: ''
      });

      //subscribes to the add review method, which means that it is being executed
      //The first argument is if it succeeded and the second if it fails
      this.reviewService.addReview(reviewDto)
        .subscribe(
          //if the request succeeds
          () => this.refreshMovieWithMessage('Successfully added the review!'),
          //if the request dont succeed
          () => this.refreshMovieWithMessage('There was an error adding the review')
        )
    }
  }

  //is ran when the delete button is clicked
  deleteReview(id : number){
    this.reviewService.deleteReview(id)
      .subscribe(
        () => this.refreshMovieWithMessage('Successfully deleted the review!'),
        () => this.refreshMovieWithMessage('There was an error deleting the review')
      )
  }

  //-------------Utilities------------------

  editReview(review: IReview) {
    this.editingReview = review;
    this.editReviewForm.setValue({
      grade: String(review.grade),
      comment: review.comment
    });
    this.showEditForm();
  }

  showEditForm(){
    this.showHideEditForm = !this.showHideEditForm
  }

  refreshMovieWithMessage(message: string) {
    this.snackBar.open(message, 'close', { duration: 3000 });
    this.movie$ = this.movieService.getMovieById(this.movieId);
  }

//-------------Utilities------------------

}

import {Component, inject, OnInit} from '@angular/core';
import {MovieService} from "../../services/movie.service";
import {Observable} from "rxjs";
import {IMovie} from "../../interfaces/IMovie";
import {AsyncPipe, JsonPipe, NgFor, NgIf} from "@angular/common";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {IUpdateMovieDto} from "../../interfaces/Dtos/iupdate-movie-dto";
import {IAddMovieDto} from "../../interfaces/Dtos/iadd-movie-dto";
import {MatSnackBar} from "@angular/material/snack-bar";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    NgFor,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatIcon,
    RouterLink,
    FormsModule,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css'
})
export class MovieComponent implements OnInit{

  authService = inject(AuthService);
  movieService = inject(MovieService);
  snackBar = inject(MatSnackBar);
  fb = inject(FormBuilder)

  //^^^^^^^^^^^^Dependencies^^^^^^^^^^^^^^^

  //This is used to show and hide the form
  openAddForm : boolean = false;
  openEditForm : boolean = false;

  //to hold the value when updating a movie
  editingMovieId: number | null = null;

  //Passing the observable to this, and will then use it in the template
  movies$? : Observable<IMovie[]>;

  //This will be ran when the component is rendered
  ngOnInit() : void {
    this.movies$ = this.movieService.getAllMovies();
  }

  //Form to add a movie and also update
  addMovieForm = this.fb.group({
    title: ['', [Validators.required]],
    releaseYear: ['', [Validators.required, Validators.min(1900), Validators.max(2024)]],
  });

  //TODO make another validation to delete the movie
  //When clicking the delete button
  deleteMovie(movieId : number){
    this.movieService.deleteMovie(movieId)
      .subscribe(
        //if it is successful
        () => this.refreshMoviesWithMessage('Successfully deleted the movie'),
        //if it throws an error
        () => this.refreshMoviesWithMessage('There was an error deleting the movie')
      )
  }

  //function to handle the submit of the edit form
  submitEditForm(){
    if(this.addMovieForm.valid){
      let updateMovieDto: IUpdateMovieDto = {
        id: this.editingMovieId ?? 0,
        title: this.addMovieForm.get('title')?.value ?? "",
        releaseYear: Number(this.addMovieForm.get('releaseYear')?.value ?? "")
      };

      this.removeEditForm();

      this.movieService.updateMovie(updateMovieDto)
        .subscribe(
          //if the request succeeds
          () => this.refreshMoviesWithMessage('Successfully updated the movie!'),
          () => this.refreshMoviesWithMessage('There was an error updating the movie')
        )
    }
  }

  //When submitting the add movie form
  submitAddForm(){

    if(this.addMovieForm.valid){
      let editUserDto: IAddMovieDto = {
        title: this.addMovieForm.get('title')?.value ?? "",
        releaseYear: Number(this.addMovieForm.get('releaseYear')?.value ?? "")
      };

      this.hideForm();

      this.movieService.addMovie(editUserDto)
        .subscribe(
          //if the request succeeds
          () => this.refreshMoviesWithMessage('Successfully added the movie!'),
          //if the request dont succeed
          () => this.refreshMoviesWithMessage('There was an error adding the movie')
      )
    }
  }

  //----------Utilities-------------

  //function that sets the value of the fields to the current movie clicked
  displayEditForm(movie : IMovie){
    this.addMovieForm.setValue({
      title: movie.title,
      releaseYear: String(movie.releaseYear)
    });
    this.editingMovieId = movie.id;
    this.openEditForm = true;
  }

  //for clearing the fields after taking down the edit form
  //because they are using the same form
  removeEditForm(){
    this.addMovieForm.setValue({
      title: '',
      releaseYear: ''
    });
    this.openEditForm = false;
  }

  hideForm(){
    this.openAddForm = false;
    this.addMovieForm.reset({
      title: '',
      releaseYear: ''
    });
  }

  refreshMoviesWithMessage(message: string) {
    this.snackBar.open(message, 'close', { duration: 3000 });
    this.movies$ = this.movieService.getAllMovies();
  }

  //---------Utilities-------------
}

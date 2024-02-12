import { Routes } from '@angular/router';
import {MovieComponent} from "./pages/movie/movie.component";
import {MoviedetailsComponent} from "./pages/moviedetails/moviedetails.component";
import {HomeComponent} from "./pages/home/home.component";
import {LoginComponent} from "./pages/login/login.component";
import {RegisterComponent} from "./pages/register/register.component";

export const routes: Routes = [
  {path: '', title: 'Home', component: HomeComponent},
  {path: 'movies', title: 'Movies', component: MovieComponent},
  {path: 'movies/:id', title: 'Movie Details', component: MoviedetailsComponent},
  {path: 'login', title: 'Login', component: LoginComponent},
  {path: 'register', title: 'Register', component: RegisterComponent}
];

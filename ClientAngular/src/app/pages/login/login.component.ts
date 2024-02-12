import {Component, inject} from '@angular/core';
import {LoginformComponent} from "../../components/loginform/loginform.component";
import {RegisterformComponent} from "../../components/registerform/registerform.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    LoginformComponent,
    RegisterformComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  //injecting the router to be able to redirect
  router = inject(Router);

  //^^^^^^^^^^^^^^Dependencies^^^^^^^^^^^^^^^^^^

  //this is from the loginform component that passes a boolean,
  //if it is true (the login was successful) i am being redirected
  //to the movies route
  handleLoginResult(result : boolean){
    if(result){
      this.router.navigateByUrl('/movies');
    }
  }
}

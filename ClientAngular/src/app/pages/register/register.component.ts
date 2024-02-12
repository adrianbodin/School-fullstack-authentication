import {Component, inject} from '@angular/core';
import {RegisterformComponent} from "../../components/registerform/registerform.component";
import {AuthService} from "../../services/auth.service";
import {IRegister} from "../../interfaces/iregister";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RegisterformComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  //injecting the router to be able to redirect
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  //^^^^^^^^^^^^^^^^Dependencies^^^^^^^^^^^^^^^^^^^^^^

  //Handles the result of the register form
  handleRegisterResult(result : boolean){
    if(result){
      this.router.navigateByUrl('/login');
      this.snackBar.open('You have been registered successfully!', 'Close', {
        duration: 3000,
      })
    }
  }
}

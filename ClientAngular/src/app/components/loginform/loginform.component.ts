import {Component, DestroyRef, EventEmitter, inject, Output} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ILogin} from "../../interfaces/ilogin";
import {ITokenResponse} from "../../interfaces/ITokenResponse";

@Component({
  selector: 'app-loginform',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule
  ],
  templateUrl: './loginform.component.html',
  styleUrl: './loginform.component.css'
})
export class LoginformComponent {

  //TODO add validation and form
  @Output() formSubmit = new EventEmitter<boolean>();

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  //is used to unsubscribe to the post event when the components is destroyed
  private destroyRef = inject(DestroyRef);
  //^^^^^^^^^^^^^^^^Dependencies^^^^^^^^^^^^^^^^^^^^

  //This is the template for the register form, and also has the validation for the form
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  }, { updateOn: 'blur' });


  //When the form is submitted i call the register service and
  //emits true if the request was successful and opens a snackbar if
  //it was not successful
  onSubmit() {
    if (this.loginForm.valid) {
      //need to do this to be able to access the values of the form
      const email = this.loginForm.get('email')?.value ?? '';
      const password = this.loginForm.get('password')?.value ?? '';
      const registerData: ILogin = { email, password };


      //subscribes to the register function in the authservice and
      //i also use takeuntildestroyed that is used to unsubscribe when
      //the component is destroyed
      this.authService.login(registerData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(
          (response : ITokenResponse) => {
            this.formSubmit.emit(true)
            localStorage.setItem("token", response.accessToken);
            this.authService.user.set({ email });
            console.log(this.authService.user());
          },
          () => this.snackBar.open('Error logging in, please try again', 'close', { duration: 3000 })
        )
    }
  }
}

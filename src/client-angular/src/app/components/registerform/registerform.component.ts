import {Component, DestroyRef, EventEmitter, inject, Output} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from "@angular/material/card";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField} from "@angular/material/form-field";
import {MatInput,MatLabel} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {passwordmatchvalidator} from "../../Validators/passwordmatchvalidator";
import {IRegister} from "../../interfaces/iregister";
import {AuthService} from "../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-registerform',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatCardActions,
    MatButton,
    ReactiveFormsModule,
    MatError
  ],
  templateUrl: './registerform.component.html',
  styleUrl: './registerform.component.css'
})
export class RegisterformComponent {
  //TODO add validation and form
  //This is used to send the event that the register is successful
  @Output() formSubmit = new EventEmitter<boolean>();

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  //^^^^^^^^^^^^^^^^Dependencies^^^^^^^^^^^^^^^^^^^^

  //This is the template for the register form, and also has the validation for the form
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]]
  }, {validators: [passwordmatchvalidator], updateOn: 'blur'});

  //When the form is submitted i call the register service and
  //emits true if the request was successful and opens a snackbar if
  //it was not successful
  onSubmit() {
    if (this.registerForm.valid) {
      //need to do this to be able to access the values of the form
      const email = this.registerForm.get('email')?.value ?? '';
      const password = this.registerForm.get('password')?.value ?? '';
      const registerData: IRegister = { email, password };


      //subscribes to the register function in the authservice
      //and sent the emit to the parent and they can do whatever they
      //want to do, in this case, navigate to a different page
      this.authService.register(registerData)
        .subscribe(
          () =>  this.formSubmit.emit(true),
          () => this.snackBar.open('Error registering user', 'close', { duration: 3000 })
        )

    }
  }
}

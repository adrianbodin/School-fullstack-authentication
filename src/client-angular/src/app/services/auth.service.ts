import {inject, Injectable, signal} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {IRegister} from "../interfaces/iregister";
import {Observable} from "rxjs";
import {ILogin} from "../interfaces/ilogin";
import {ITokenResponse} from "../interfaces/ITokenResponse";
import {IUser} from "../interfaces/iuser";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);

  //TODO make this better
  //This is used to see the email from the current logged in user in different components
  //For example in the header when to show the different button
  user = signal<IUser | null | undefined>(undefined);

  apiUrl = environment.apiUrl;

  //Http request to register a user
  register(registerData : IRegister ) :  Observable<HttpResponse<any>>{
    return this.http.post<HttpResponse<any>>(`${this.apiUrl}/register`, registerData)
  }

  //Http request to login
  login(loginData : ILogin) : Observable<ITokenResponse> {
    return this.http.post<ITokenResponse>(`${this.apiUrl}/login`, loginData)
  }

}

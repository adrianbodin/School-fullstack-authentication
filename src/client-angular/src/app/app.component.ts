import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatToolbar} from "@angular/material/toolbar";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {AuthService} from "./services/auth.service";
import {HttpClient} from "@angular/common/http";
import {IUserInfo} from "./interfaces/IUserInfo";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbar, MatButton, RouterLink, RouterLinkActive, MatIcon],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  //TODO fix responsiveness
  authService = inject(AuthService);
  http = inject(HttpClient);


  //this ran everytime the page is reloaded to see if the token is is localstorage and then
  //logs in the user automatically.
  ngOnInit(): void {
    //Getting the token from local storage
    const token = localStorage.getItem('token');
    const url = `${this.authService.apiUrl}/manage/info`;
    this.http.get<IUserInfo>(url, { headers: { 'Authorization': `Bearer ${token}` } })
      .subscribe(
        (response) => this.authService.user.set({email: response.email }),
        () => this.authService.user.set(null));
  }

  //sets the token in localstorage to an empty string and sets the user to null
  logout(): void {
    localStorage.setItem('token', '');
    this.authService.user.set(null);
  }

}

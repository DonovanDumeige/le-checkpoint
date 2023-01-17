import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface LoginForm {
  username: string;
  password: string;
}

export interface User {
  name: string,
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  role: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {



  constructor(private http:HttpClient) {}

  register(user: User){
    return this.http.post<any>('http://localhost:3000/auth/signin', user).pipe(
      map(user => user))
  }

  login(loginForm: LoginForm) {
    return this.http.post<any>('http://localhost:3000/auth/login', {
    username: loginForm.username,
    password:loginForm.password}).pipe(
      map((token) => {
        localStorage.setItem('access_token', token.access_token);
        return token;
      })
    );
  }
}

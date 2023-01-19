import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface LoginForm {
  username: string;
  password: string;
}

export interface User {
  name?: string,
  username?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
  role?: string;
  profileImage?: string;
}

export const JWT_TOKEN  = 'access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor(private http:HttpClient, private jwtHelper: JwtHelperService) {}

  register(user: User){
    return this.http.post<any>('http://localhost:3000/auth/signin', user).pipe(
      map(user => user))
  }

  login(loginForm: LoginForm) {
    return this.http.post<any>('http://localhost:3000/auth/login', {
    username: loginForm.username,
    password:loginForm.password}).pipe(
      map((token) => {
        localStorage.setItem(JWT_TOKEN, token.access_token);
        return token;
      })
    );
  }

  isAuthenticated() {
    const token =localStorage.getItem(JWT_TOKEN);
    return !this.jwtHelper.isTokenExpired(token)


  }
}

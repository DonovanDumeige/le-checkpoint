import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { map, switchMap, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.interface';

export interface LoginForm {
  username: string;
  password: string;
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

  getUserId(): Observable<number>{
    return of(localStorage.getItem(JWT_TOKEN)).pipe(
      switchMap((jwt: any) => of(this.jwtHelper.decodeToken(jwt)).pipe(
        map((jwt: any) => jwt.id)
      )
    ));
  }


}

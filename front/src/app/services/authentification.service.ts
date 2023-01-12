import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor(private http:HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<any>('http://localhost:3000/auth/login', {username, password}).pipe(
      map((token) => {
        console.log(token.access_token);
        localStorage.setItem('blog-token', token.access_token);
        return token;
      })
    );
  }
}

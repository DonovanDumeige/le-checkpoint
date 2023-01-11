import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  constructor(private http:HttpClient) { }

  login(email: string, password: string) {
    return this.http.post<any>('http://localhost:3000/auth/login', {email, password})
  }
}

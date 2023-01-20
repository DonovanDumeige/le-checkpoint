import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user.interface';

export interface UserData {
  items: User[],
  meta: {
    totalItems: number,
    itemCount: number,
    itemsPerPage: number,
    totalPages: number,
    currentPage: number,
  },
  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  }

}
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  findOne(id: number): Observable<User> {
    console.log('test');
    return this.http.get<any>('http://localhost:3000/user/' + id).pipe(
      map((user: User) => user)
    );


  }
  findAll(page: number, size: number): Observable<UserData> {
    let params = new HttpParams();
    params = params.append('page', String(page));
    params = params.append('limit', String(size))
    return this.http.get<any>('http://localhost:3000/user/index', { params }).pipe(
      map((userData: UserData) => userData),
      catchError(err => throwError(() => err))
    )
  }

  uploadProfileImage(formData: FormData): Observable<any> {
    return this.http.post<FormData>("http://localhost:3000/user/upload", formData, {
      reportProgress: true,
      observe: 'events',
    }
    )
  }
  paginateByName(page: number, size: number, username: string): Observable<UserData> {
    let params = new HttpParams();
    params = params.append('page', String(page));
    params = params.append('limit', String(size));
    params = params.append('username', username);

    return this.http.get<any>('http://localhost:3000/user/index', { params }).pipe(
      map((userData: UserData) => userData),
      catchError(err => throwError(() => err))
    )
  }
  updateUser(user: User): Observable<User> {
    return this.http.put<any>('http://localhost:3000/user/' + user.id, user)
  }

  //fin classe
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BlogArticlesPageable } from '../models/blog-article.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) {}

  indexAll(page: number, size: number) : Observable<BlogArticlesPageable> {
    let params = new HttpParams()

    params = params.append('page', String(page));
    params = params.append('limit', String(size));

    return this.http.get<BlogArticlesPageable>('/api/blog/index', {params}).pipe(
      tap(a => console.log('tap ? ', a))
    );
  }
}

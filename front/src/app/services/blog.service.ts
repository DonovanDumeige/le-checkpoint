import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BlogArticle, BlogArticlesPageable } from '../models/blog-article.interface';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) {}

  indexAll(page: number, size: number) : Observable<BlogArticlesPageable> {
    let params = new HttpParams()

    params = params.append('page', String(page));
    params = params.append('limit', String(size));

    return this.http.get<BlogArticlesPageable>('/api/blog/index', {params});
  }

  post(article:BlogArticle): Observable<BlogArticle> {
    return this.http.post<BlogArticle>('/api/blog', article)
  }

  uploadHeaderImage(formData: FormData): Observable<any> {
    return this.http.post<FormData>(`api/blog/image/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    })
  }
}

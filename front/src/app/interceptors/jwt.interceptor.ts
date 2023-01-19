import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { JWT_TOKEN } from '../services/authentification.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor() {}

  /**
   * L'intercepteur va ici soit rechercher le Json Web Token ou retourner simplement
   * la requete si il n'y a pas de token.
   *  Permet d'ajouter des autorisations sur les routes, comme sur NestJS
   **/
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = localStorage.getItem(JWT_TOKEN);
    if(token) {
      const clonedReq = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token)
      })
      return next.handle(clonedReq)
    }
    else {
      return next.handle(request);
    }

  }
}

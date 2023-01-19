import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthentificationService,
    private router:Router,
    ) {}

    /**
     * Vérifie si l'user est authentifié grâce à son JWT. Si c'est le cas, retourne vrai et
     * la requête se poursuit normalement.
     *
     * Sinon, retourne faux et renvoie à la page de connexion.
     */
  canActivate(): boolean {
    if(!this.auth.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

}

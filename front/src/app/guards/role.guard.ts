
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Role } from '../models/role.enum';
import { AuthentificationService } from '../services/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private auth: AuthentificationService,
    private router: Router,
  ) { }

  /**
   * Vérifie si l'user est authentifié grâce à son JWT. Si c'est le cas, retourne vrai et
   * la requête se poursuit normalement.
   *
   * Sinon, retourne faux et renvoie à la page de connexion.
   */
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.auth.isAuthenticated()) {

    let userRole = localStorage.getItem('role')
    console.log('Mon role ? ', userRole)
    console.log(route.data['role'].indexOf(userRole))
      if (route.data['role'] && route.data['role'].indexOf(userRole) === -1) {
        this.router.navigate(['home']);
        return false
      }
      return true
    }
    this.router.navigate(['login'])
    return false;
  }

}

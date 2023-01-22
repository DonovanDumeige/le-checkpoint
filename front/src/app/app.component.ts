import { Component, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/user.interface';
import { AuthentificationService } from './services/authentification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front';
  entries = [
  {
    title: "Connexion"
  },
  {
    title:"S'inscrire"
  },
  {
    title: "Editer mon profil"
  }
]
  constructor(
    private router: Router,
    private auth: AuthentificationService) {}

  navigateTo(value:any) {
    this.router.navigate(['../', value]);
  }

  logout() {
    this.auth.logout()
    this.router.navigate(['home'])
  }
}

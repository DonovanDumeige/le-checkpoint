import { Component, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from './models/user.interface';
import { AuthentificationService } from './services/authentification.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
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
  },
  {
    title: "Supprimer mon profil"
  }

]
role!: string|null;
userID!: number;
private sub!: Subscription;

  constructor(
    private router: Router,
    private auth: AuthentificationService,
    private user: UserService,
    private activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {

      this.getRole()
      this.getRole()
    }
  navigateTo(value:any) {
    this.router.navigate(['../', value]);
  }

  logout() {
    this.auth.logout()
    this.router.navigate(['home'])
    this.role = null;
  }

  getID() {
    this.auth.getUserId().subscribe(
      (id) => this.userID = id
    )
  }
  getRole(){
    let role = localStorage.getItem('role')
    if(role !== null)
      this.role = role
    else
      this.role = null;
    console.log('role from app', role)
  }

  reload(){
    window.location.reload()
  }
}

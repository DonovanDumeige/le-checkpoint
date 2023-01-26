import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/authentification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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

role!: string;
  constructor(
    private router: Router,
    private auth: AuthentificationService) {}
  ngOnInit(): void {

  }
  navigateTo(value:any) {
    this.router.navigate(['../', value]);
  }

  logout() {
    this.auth.logout()
    this.router.navigate(['home'])
  }

  getRole(){

    let role = localStorage.getItem('role')
    if(role !== null) {
      this.role = role
      console.log(this.role);
    }


  }
}

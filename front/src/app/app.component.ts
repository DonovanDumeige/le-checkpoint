import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front';

  entries = [{
    name: 'Login',
    link: 'login',
  },
  {
    name: 'Register',
    link: 'register',
  },
  {
    name: 'Update Profile',
    link: 'update-profile'
  }
]
  constructor(private router: Router) {}

  navigateTo(value:any) {
    this.router.navigate(['../', value]);
  }
}

import { Component, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'front';
  userRole = 'admin'
  user!: User;
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
ngOnInit(): void {
  console.log('Role ?', this.user.role)
}
  navigateTo(value:any) {
    this.router.navigate(['../', value]);
  }
}

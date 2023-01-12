import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from 'src/app/services/authentification.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup

  constructor(
    private authservice: AuthentificationService,
    private router: Router) {}

    ngOnInit(): void {
      this.loginForm = new FormGroup({
        username: new FormControl('', [
          Validators.required,
          Validators.minLength(3)
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ])
      })
    }

    onSubmit() {
      if(this.loginForm.invalid){
        return;
      }
      this.authservice.login(this.loginForm.value).pipe(
        map(token => this.router.navigate(['admin']))
        ) .subscribe();
    }
  // login() {
  //   this.authservice.login('admin', '123456').subscribe(data => console.log('success'));

  // }

}

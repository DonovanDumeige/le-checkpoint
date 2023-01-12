import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthentificationService } from 'src/app/services/authentification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor( private authservice: AuthentificationService) {}
  login() {
    this.authservice.login('admin', '123456').subscribe(data => console.log('success'));

  }

}

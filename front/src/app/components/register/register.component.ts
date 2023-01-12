import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthentificationService } from 'src/app/services/authentification.service';

@Component({



  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm! : FormGroup;

  constructor(
    private authService: AuthentificationService,
    private formBuilder: FormBuilder,
    private router:Router) {}

    ngOnInit(): void {
      this.registerForm = this.formBuilder.group({
        name:['', [Validators.required]],
        username:['', [Validators.required]],
        email: ['', [
          Validators.required,
          Validators.email,
        ]],
        password: ['', [
          Validators.required,
          Validators.minLength(3),
        ]],
        passwordConfirm: ['', [Validators.required]]
      },
      {
        // validators: CustomValidators.passwordMatches
      })
    }

    onSubmit() {
      if(this.registerForm.invalid){return;}
      console.log(this.registerForm.value)
      this.authService.register(this.registerForm.value).pipe(map(user => this.router.navigate(['login']))
      ).subscribe()
    }
}

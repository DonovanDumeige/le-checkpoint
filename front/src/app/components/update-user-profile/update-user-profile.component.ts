import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { AuthentificationService, User } from 'src/app/services/authentification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-user-profile',
  templateUrl: './update-user-profile.component.html',
  styleUrls: ['./update-user-profile.component.css']
})
export class UpdateUserProfileComponent implements OnInit {

  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthentificationService,
    private userService: UserService
  ){}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [{value: null, disabled: true}],
      name: [null],
      username: [null]
    });

    this.authService.getUserId().pipe(
      switchMap((id: number) => this.userService.findOne(id).pipe(
        tap((user: User) => {
          this.form.patchValue({
            id: user.id,
            name: user.name,
            username: user.username
          })
        })
      ))
    ). subscribe()
  }

  update() {
    this.userService.updateUser(this.form.getRawValue()).subscribe();
  }
}

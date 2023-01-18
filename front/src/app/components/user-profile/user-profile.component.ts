import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from 'src/app/services/authentification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy{

  userId: number|null = null;
  private sub!: Subscription;
  user: User|null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void{
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.userId = parseInt(params['id']);
      this.userService.findOne(this.userId).pipe(
        map((user: User) => this.user = user)
      ).subscribe()
    });
  }

  ngOnDestroy():void  {
    this.sub.unsubscribe();
  }
}

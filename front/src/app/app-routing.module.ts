import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateUserProfileComponent } from './components/users/update-user-profile/update-user-profile.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './components/users/user-profile/user-profile.component';
import { UsersComponent } from './components/users/users.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m=>m.AdminModule)
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'users/:id',
    component: UserProfileComponent,
  },
  {
    path: 'update-profile',
    component: UpdateUserProfileComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

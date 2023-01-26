import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateUserProfileComponent } from './components/users/update-user-profile/update-user-profile.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { UserProfileComponent } from './components/users/user-profile/user-profile.component';
import { UsersComponent } from './components/users/users.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { CreateArticleComponent } from './components/blog/create-article/create-article.component';
import { ViewBlogArticleComponent } from './components/blog/view-blog-article/view-blog-article.component';
import { RoleGuard } from './guards/role.guard';


const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m=>m.AdminModule),
    canActivate:[RoleGuard],
    data: {
      role: ["admin", "editor", "chiefeditor"]
    }
  },
  {
    path:'home',
    component: HomeComponent
  },
  {
    path:'create-article',
    component: CreateArticleComponent,
    canActivate: [RoleGuard],
    data: {
      role: "editor"
    }

  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users/:id',
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'update-profile',
    component: UpdateUserProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'article/:id',
    component: ViewBlogArticleComponent,
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

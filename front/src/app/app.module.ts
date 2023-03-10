import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatButtonModule} from '@angular/material/button'
import {MatSelectModule} from '@angular/material/select';
import { UsersComponent } from './components/users/users.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { UserProfileComponent } from './components/users/user-profile/user-profile.component';
import { MatCardModule} from '@angular/material/card';
import { UpdateUserProfileComponent } from './components/users/update-user-profile/update-user-profile.component'
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import { HomeComponent } from './components/home/home.component';
import { AllBlogArticlesComponent } from './components/blog/all-blog-articles/all-blog-articles.component';
import { registerLocaleData } from '@angular/common';
import * as fr from "@angular/common/locales/fr";
import { CreateArticleComponent } from './components/blog/create-article/create-article.component'
import { WINDOW_PROVIDERS } from './window-token';
import { MarkdownModule } from 'ngx-markdown';
import { ViewBlogArticleComponent } from './components/blog/view-blog-article/view-blog-article.component';
import {LayoutModule} from '@angular/cdk/layout';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UsersComponent,
    UserProfileComponent,
    UpdateUserProfileComponent,
    HomeComponent,
    AllBlogArticlesComponent,
    CreateArticleComponent,
    ViewBlogArticleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    HttpClientModule,

    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,

    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,

    MarkdownModule.forRoot(),

    LayoutModule,



  ],
  providers: [
    WINDOW_PROVIDERS,
    JwtHelperService,
    {
      provide: JWT_OPTIONS,
      useValue: JWT_OPTIONS,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: LOCALE_ID, useValue: "fr-FR"
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(fr.default)
  }
}

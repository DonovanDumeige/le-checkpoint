import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { BlogArticle, BlogArticlesPageable } from 'src/app/models/blog-article.interface';
import { User } from 'src/app/models/user.interface';
import { AuthentificationService } from 'src/app/services/authentification.service';
import { BlogService } from 'src/app/services/blog.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  title = 'admin';
  user!: User;
  dataSource!: BlogArticlesPageable;
  pageEvent!: PageEvent;
  displayedColumns: string[] = ['id', 'title']
  row: any;
  userID!: number;
  role!: string;
  constructor(
    private blogService: BlogService,
    private authService: AuthentificationService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.initDataSource();
    this.getID();
    this.getRole();
  }
  initDataSource() {
    this.blogService.indexAll(1, 10).pipe(
      map((blogData: BlogArticlesPageable) => this.dataSource = blogData)
    ).subscribe();
  }

  onPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;

    page = page + 1;
    this.blogService.indexAll(page, size).pipe(
      map((blogData: BlogArticlesPageable) => this.dataSource = blogData)
    ).subscribe();
  }

  getID() {
    this.authService.getUserId().subscribe(
      (id) => this.userID = id
    )
  }

  getRole(){

    let role = localStorage.getItem('role')
    if(role !== null)
      this.role = role
  }
}


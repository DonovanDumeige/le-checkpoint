import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { BlogArticle, BlogArticlesPageable } from 'src/app/models/blog-article.interface';
import { BlogService } from 'src/app/services/blog.service';


@Component({
  selector: 'app-all-blog-articles',
  templateUrl: './all-blog-articles.component.html',
  styleUrls: ['./all-blog-articles.component.css']
})
export class AllBlogArticlesComponent implements OnInit {

  dataSource: Observable<BlogArticlesPageable> = this.blogService.indexAll(1,10);
  pageEvent!: PageEvent;
  constructor(private blogService: BlogService) {}

  ngOnInit(): void {

  }

  onPaginateChange(event: PageEvent) {
    let page= event.pageIndex;
    let size =  event.pageSize;

    page= page+1;

    this.dataSource = this.blogService.indexAll(page, size)
  }
}

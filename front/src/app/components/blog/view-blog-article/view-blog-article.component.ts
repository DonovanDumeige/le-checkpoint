import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlogArticle } from 'src/app/models/blog-article.interface';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-view-blog-article',
  templateUrl: './view-blog-article.component.html',
  styleUrls: ['./view-blog-article.component.css']
})
export class ViewBlogArticleComponent implements OnInit {

  // Permet d'affecter l'ID de params à l'ID de l'article
  // le $ sert de convention pour nommer les observables.
  article$: Observable<BlogArticle> = this.activedRoute.params.pipe(
    switchMap((params: Params) => {
      const articleID: number = parseInt(params['id']);

      return this.blogService.findOne(articleID).pipe(
        map((blog: BlogArticle) => blog)
      )
    })
  )
  constructor(
    private activedRoute: ActivatedRoute,
    private blogService: BlogService,
  ) { }

  ngOnInit(): void {

  }


}

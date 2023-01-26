import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-delete-article',
  templateUrl: './delete-article.component.html',
  styleUrls: ['./delete-article.component.css']
})
export class DeleteArticleComponent implements OnInit {

  articleId: number | null = null;
  private sub!: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService,
    private router: Router) { }
  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.articleId = parseInt(params['id']);
      console.log(this.articleId)
      this.blogService.delete(this.articleId).pipe()
    }
    )


    this.router.navigate(['admin']);
  }
}


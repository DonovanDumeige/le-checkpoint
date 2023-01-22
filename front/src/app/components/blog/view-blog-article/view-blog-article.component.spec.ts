import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBlogArticleComponent } from './view-blog-article.component';

describe('ViewBlogArticleComponent', () => {
  let component: ViewBlogArticleComponent;
  let fixture: ComponentFixture<ViewBlogArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBlogArticleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBlogArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

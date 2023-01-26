import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { BlogArticle } from 'src/app/models/blog-article.interface';
import { BlogService } from 'src/app/services/blog.service';

export interface File{
  data: any;
  progress: number;
  inProgress: boolean;
}

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css']
})


export class EditArticleComponent implements OnInit{

  @ViewChild('fileUpload', {static: false}) fileUpload!:ElementRef

  file: File = {
    data: null,
    inProgress: false,
    progress: 0
  }
  private sub!: Subscription;
  articleID!: number;
  form!: FormGroup;

  article!:BlogArticle;

  constructor(
    private formBuilder: FormBuilder,
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
  ) {

  }

  ngOnInit(): void
  {

    console.log('Route ?', ActivatedRoute)
    this.form = this.formBuilder.group({
      id: [{value: null, disabled: true}],
      title:[null,[Validators.required]],
      slug:[{value: null,disabled: true}],
      description:[null, [Validators.required]],
      content:[null, [Validators.required]],
      headerImage:[null]
    })

    this.sub = this.activatedRoute.params.subscribe(params => {
      this.articleID = parseInt(params['id']);
    })
    this.blogService.findOne(this.articleID).pipe(
      map((article: BlogArticle) =>{
        this.form.patchValue({
          id: article.id,
          title: article.title,
          slug: article.slug,
          description: article.description,
          content: article.content,
          headerImage: article.headerImage
        })
        console.log('article ?', article)
      })
    ).subscribe()
  }

  onClick()
   {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.click();
    fileInput.onchange = () => {
      this.file = {
        data: fileInput.files[0],
        progress: 0,
        inProgress: false
      };;
      this.fileUpload.nativeElement.value = "";
      this.uploadFile()
    }
  }

  uploadFile()
  {
    const file = this.file;

    const formData = new FormData();

    formData.append('file', this.file.data);
    this.file.inProgress = true;

    this.blogService.uploadHeaderImage(formData).pipe(
      map((event:any) => {
        switch(event.type) {
          case HttpEventType.UploadProgress:
            this.file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error:HttpErrorResponse) => {
        this.file.inProgress = false;
        return of('Upload failed')
      })
    ).subscribe((event:any) => {
      if(typeof(event) === 'object') {
        this.form.patchValue({headerImage: event.body.headerImage})
      }
    })

  }

  update(){
    this.blogService.update( this.form.getRawValue()).subscribe();
    this.router.navigate(['admin'])
  }
}

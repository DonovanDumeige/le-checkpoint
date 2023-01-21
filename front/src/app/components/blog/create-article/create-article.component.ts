import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { BlogService } from 'src/app/services/blog.service';

export interface File {
  data: any;
  progress: number;
  inProgress: boolean;
}
@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent implements OnInit {

  @ViewChild('fileUpload', {static: false}) fileUpload!: ElementRef;

  file: File = {
    data: null,
    progress: 0,
    inProgress: false,
  }

  form!: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private blog: BlogService,
    ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [{value: null, disabled: true}],
      title: [null, [Validators.required]],
      slug: [{value: null, disabled: true}],
      description: [null, [Validators.required]],
      content: [null, [Validators.required]],
      headerImage: [null, [Validators.required]]
    })
  }

  post() {
    this.blog.post(this.form.getRawValue()).subscribe();
  }

  onClick() {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.click();
    fileInput.onchange = () => {
      this.file = {
        data: fileInput.files[0],
        inProgress: false,
        progress: 0,
      }
    };
    this.fileUpload.nativeElement.value = '';
    this.uploadFile();
  }

  uploadFile(){
    const formData = new FormData();
    formData.append('file', this.file.data);
    this.file.inProgress = true;

    this.blog.uploadHeaderImage(formData).pipe(
      map((event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.file.inProgress = false;
        return of('Upload failed');
      })
    ).subscribe((event: any) => {
      if (typeof (event) === 'object') {
        this.form.patchValue({ headerImage: event.body.filename });
      }
    })

  }
}

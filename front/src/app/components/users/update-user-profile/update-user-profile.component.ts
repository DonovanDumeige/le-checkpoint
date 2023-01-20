import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthentificationService, User } from 'src/app/services/authentification.service';
import { UserService } from 'src/app/services/user.service';

export interface File {
  data: any;
  progress: number;
  inProgress: boolean;
}
@Component({
  selector: 'app-update-user-profile',
  templateUrl: './update-user-profile.component.html',
  styleUrls: ['./update-user-profile.component.css']
})
export class UpdateUserProfileComponent implements OnInit {


  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;

  file: File = {
    data: null,
    inProgress: false,
    progress: 0,

  }
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthentificationService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [{ value: null, disabled: true }],
      name: [null, [Validators.required]],
      username: [null, [Validators.required]],
      profileImage: ['']
    });

    this.authService.getUserId().pipe(
      switchMap((id: number) => this.userService.findOne(id).pipe(
        tap((user: User) => {
          this.form.patchValue({
            id: user.id,
            name: user.name,
            username: user.username,
            profileImage: user.profileImage
          })
        })
      ))
    ).subscribe()
  }

  onClick() {
    const fileInput = this.fileUpload.nativeElement;
    fileInput.click();
    fileInput.onchange = () => {
      this.file = {
        data: fileInput.files[0],
        inProgress: false,
        progress: 0
      };
      this.fileUpload.nativeElement.value = '';
      this.uploadFile();
    }
  }

  uploadFile() {
    const file = this.file;

    const formData = new FormData();

    formData.append('file', this.file.data);
    this.file.inProgress = true;

    this.userService.uploadProfileImage(formData).pipe(
      map((event: any) => {
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
        this.form.patchValue({ profileImage: event.body.profileImage })
      }
    })
  }
  update() {
    this.userService.updateUser(this.form.getRawValue()).subscribe();
  }
}

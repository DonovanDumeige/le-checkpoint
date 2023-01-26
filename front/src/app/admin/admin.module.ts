import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { AdminRoutingModule } from './admin-routing.module';
import { OverviewComponent } from './components/overview/overview.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import { MatCardModule} from '@angular/material/card';
import { EditArticleComponent } from './components/edit-article/edit-article.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MarkdownModule } from 'ngx-markdown';
import { MatInputModule } from '@angular/material/input';
import { DeleteArticleComponent } from './components/delete-article/delete-article.component';
@NgModule({
  declarations: [
    OverviewComponent,
    EditArticleComponent,
    DeleteArticleComponent

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatToolbarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MarkdownModule,
    MatInputModule


  ]
})
export class AdminModule { }

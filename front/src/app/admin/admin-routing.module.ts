import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../guards/role.guard';
import { DeleteArticleComponent } from './components/delete-article/delete-article.component';
import { EditArticleComponent } from './components/edit-article/edit-article.component';
import { OverviewComponent } from './components/overview/overview.component';

const routes: Routes = [
  {
    path: '', pathMatch:'full', component: OverviewComponent,
  },
  {
    path: 'edit/:id',
    component:EditArticleComponent,
    canActivate: [RoleGuard],
    data: ["admin", "editor", "chiefeditor"]
  },
  {
    path: 'delete/:id',
    component: DeleteArticleComponent,
    canActivate: [RoleGuard],
    data: ["admin", "editor", "chiefeditor"]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

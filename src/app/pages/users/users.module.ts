import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersDetailComponent } from './users-detail/users-detail.component';
import { AppMaterialModuleModule } from 'src/app/app-material-module/app-material-module.module';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: UsersListComponent
  },
  {
    path: 'detail',
    component: UsersDetailComponent
  },
  {
    path: 'detail/:userid',
    component: UsersDetailComponent
  }
];

@NgModule({
  declarations: [UsersListComponent, UsersDetailComponent],
  imports: [
    CommonModule,
    AppMaterialModuleModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  exports: [RouterModule]
})
export class UsersModule { }

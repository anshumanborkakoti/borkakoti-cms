import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersDetailComponent } from './users-detail/users-detail.component';
import { UsersService } from './users.service';
import { AppMaterialModuleModule } from 'src/app/app-material-module/app-material-module.module';

@NgModule({
  declarations: [UsersListComponent, UsersDetailComponent],
  imports: [
    CommonModule,
    AppMaterialModuleModule
  ],
  providers: [UsersService]
})
export class UsersModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersDetailComponent } from './users-detail/users-detail.component';
import { UsersService } from './users.service';
import { AppMaterialModuleModule } from 'src/app/app-material-module/app-material-module.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UsersListComponent, UsersDetailComponent],
  imports: [
    CommonModule,
    AppMaterialModuleModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [UsersService]
})
export class UsersModule { }

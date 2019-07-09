import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatSidenavModule,
  MatListModule,
  MatToolbarModule,
  MatIconModule,
  MatTableModule
} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatSidenavModule, MatListModule, MatToolbarModule, MatIconModule, MatTableModule],
  exports: [MatSidenavModule, MatListModule, MatToolbarModule, MatIconModule, MatTableModule]
})
export class AppMaterialModuleModule { }

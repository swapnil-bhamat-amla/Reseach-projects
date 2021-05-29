import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyArtComponent } from './my-art.component';
import { MyArtService } from './my-art.service';
import { ConfirmAlertModule } from '../confirm-alert/confirm-alert.module';


@NgModule({
  declarations: [
    MyArtComponent,
  ],
  imports: [
    CommonModule,
    ConfirmAlertModule
  ],
  providers: [
    MyArtService
  ],
  exports: [
    MyArtComponent
  ]
})
export class MyArtModule { }

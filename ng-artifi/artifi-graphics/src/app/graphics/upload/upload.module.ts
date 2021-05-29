import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSizePipe } from './file-size.pipe';

import { UploadComponent } from './upload.component';
import { ComputerUploadComponent } from './components/computer-upload/computer-upload.component';
import { FacebookUploadComponent } from './components/facebook-upload/facebook-upload.component';
import { InstagramUploadComponent } from './components/instagram-upload/instagram-upload.component';
import { DropboxUploadComponent } from './components/dropbox-upload/dropbox-upload.component';

@NgModule({
  declarations: [
    FileSizePipe,
    UploadComponent,
    ComputerUploadComponent,
    FacebookUploadComponent,
    InstagramUploadComponent,
    DropboxUploadComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UploadComponent,
    ComputerUploadComponent,
    FacebookUploadComponent,
    InstagramUploadComponent,
    DropboxUploadComponent
  ]
})
export class UploadModule { }

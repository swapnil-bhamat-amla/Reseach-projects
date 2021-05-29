import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { ClipartsComponent } from './cliparts.component';
import { ClipartsService } from './cliparts.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NoCacheInterceptor } from './caching.interceptor';

@NgModule({
  declarations: [
    ClipartsComponent
  ],
  imports: [
    CommonModule,
    InfiniteScrollModule
  ],
  exports: [
    ClipartsComponent
  ],
  providers: [
    ClipartsService,
    { provide: HTTP_INTERCEPTORS, useClass: NoCacheInterceptor, multi: true }
  ]
})
export class ClipartsModule { }

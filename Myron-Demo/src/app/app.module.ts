import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ClipartComponent } from './clipart/clipart.component';
import { PreviewComponent } from './preview/preview.component';
import { ProductComponent } from './product/product.component';
import { ImageLoader } from './preview/image-loader.directive';

@NgModule({
  declarations: [
    AppComponent,
    ClipartComponent,
    PreviewComponent,
    ProductComponent,
    ImageLoader
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

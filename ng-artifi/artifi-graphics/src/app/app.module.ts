import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';

import { createCustomElement } from '@angular/elements';
import { ElementZoneStrategyFactory } from 'elements-zone-strategy';
import { HttpClientModule } from '@angular/common/http';

import { GraphicsComponent } from './graphics/graphics.component';
import { ImageWidgetListComponent } from './graphics/image-widget-list/image-widget-list.component';
import { ImageLibraryComponent } from './graphics/image-library/image-library.component';
import { ClipartsService } from './graphics/cliparts/cliparts.service';
import { UploadModule } from './graphics/upload/upload.module';
import { MyArtModule } from './graphics/my-art/my-art.module';
import { ConfirmAlertModule } from './graphics/confirm-alert/confirm-alert.module';
import { ClipartsModule } from './graphics/cliparts/cliparts.module';

@NgModule({
  declarations: [
    GraphicsComponent,
    ImageWidgetListComponent,
    ImageLibraryComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    UploadModule,
    MyArtModule,
    ConfirmAlertModule,
    ClipartsModule
  ],
  providers: [ClipartsService],
  // bootstrap: [AppCoponent],
  entryComponents: [GraphicsComponent]
})
export class AppModule {
  constructor(private injector: Injector) {}
  ngDoBootstrap() {

    const strategyFactory = new ElementZoneStrategyFactory(GraphicsComponent, this.injector);
    const custElement = createCustomElement(GraphicsComponent, { injector: this.injector, strategyFactory });
    customElements.define('artifi-graphics', custElement);



    // const custElement = createCustomElement(GraphicsComponent, { injector: this.injector });
    // customElements.define('artifi-graphics', custElement);
  }
}

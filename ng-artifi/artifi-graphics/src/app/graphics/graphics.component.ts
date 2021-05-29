import { Component, Input, OnInit, OnChanges, Output, EventEmitter, DoCheck } from '@angular/core';

import { localizationInit } from './localization';
import { graphicsInitState } from './graphics.schema';

@Component({
  selector: 'artifi-graphics',
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.scss']
})
export class GraphicsComponent implements OnInit, OnChanges, DoCheck {

  @Input('inputData') inputData;
  @Output() outputEvents = new EventEmitter();

  @Input() show = false;

  settings: any;

  localization = localizationInit;
  initState = graphicsInitState;

  imageWidgetData = {
    allowDelete: true,
    allowCaption: true,
    imageWidgets: [],
    activeImageWidget: 0
  };

  activeComponent = 'image_widget_list';

  // image library start

  selectedImage: any;

  // image libray end

  constructor() { }

  ngOnInit() {
    console.log('init component :: graphics component', this.inputData);
  }

  ngOnChanges() {
    console.log('changed', this.inputData);
    if (typeof this.inputData !== 'undefined' && this.inputData.hasOwnProperty('show')) {
      this.show = this.inputData.show;
    }
    if (typeof this.inputData !== 'undefined' && this.inputData.hasOwnProperty('initGraphics')) {
      this.graphicsChanges(this.inputData.initGraphics);
    }

    if (typeof this.inputData !== 'undefined' && this.inputData.hasOwnProperty('imageWidgetList')) {
      console.log('imageWidgetList :: ', this.inputData.imageWidgetList);
      this.imageWidgetList(this.inputData.imageWidgetList);
    }

    if (typeof this.inputData !== 'undefined' && this.inputData.hasOwnProperty('settings')) {
      this.settings = this.inputData.settings;
      console.log('settings :: ', this.settings);
    }

  }

  ngDoCheck() {
    // this hook is just for testing
    // console.log('::: in DoCheck ::: ');
    // console.log(this.inputData);
  }

  addGraphic() {
    this.outputEvent({ type: 'ADD_IMAGE_WIDGET' });
  }

  graphicsChanges(data) {
    if (typeof data !== 'undefined') {
      this.initState = data;
      console.log(data);
    }
  }

  imageWidgetList(data) {
    if (typeof data !== 'undefined') {
      this.imageWidgetData.imageWidgets = typeof data.imageWidgets !== 'undefined' ? data.imageWidgets : this.imageWidgetData.imageWidgets;
      this.imageWidgetData.allowCaption = typeof data.allowCaption !== 'undefined' ? data.allowCaption : this.imageWidgetData.allowCaption;
      this.imageWidgetData.allowDelete = typeof data.allowDelete !== 'undefined' ? data.allowDelete : this.imageWidgetData.allowDelete;
      console.log(data);
    }
  }

  outputEvent(data) {
    console.log(data);
    switch (data.type) {
      case 'SELECT_IMAGE_WIDGET' :
        console.log('change component');
        this.selectedImage = data.data;
        this.activeComponent = 'image_library';
        break;
    }
    this.outputEvents.emit(data);
  }

  btnBackHandler() {
    this.activeComponent = 'image_widget_list';
  }
}



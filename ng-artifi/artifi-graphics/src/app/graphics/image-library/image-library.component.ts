import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'artifi-image-library',
  templateUrl: './image-library.component.html',
  styleUrls: ['./image-library.component.scss']
})
export class ImageLibraryComponent implements OnInit {

  @Input() selectedWidget;
  @Input() localizations;
  @Input() settings;
  @Output() outputEvent = new EventEmitter();

  activeComponent = 'clipart';

  constructor() { }

  ngOnInit() {
  }


  clipartOutput(evt) {
    evt.data = { clipart: evt.data, selectedWidget : this.selectedWidget };
    this.outputEvent.emit(evt);
  }

  myartOutput(evt) {
    this.outputEvent.emit(evt);
  }

  setComponent(component) {
    this.activeComponent = component;
  }

  uploadOutput(evt) {
    this.activeComponent = evt.data;
  }
}

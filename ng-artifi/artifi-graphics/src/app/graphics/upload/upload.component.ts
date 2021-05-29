import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'artifi-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  @Input() settings;
  @Input() localizations;
  @Output() outputEvent = new EventEmitter();
  activeComponent = 'computer';

  constructor() { }

  ngOnInit() {
    console.log(this.localizations);
  }

  setComponent(component) {
    this.activeComponent = component;
  }

  outputEventHandler(evt) {
    this.outputEvent.emit(evt);
  }
}

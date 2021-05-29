import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'artifi-image-widget-list',
  templateUrl: './image-widget-list.component.html',
  styleUrls: ['./image-widget-list.component.scss']
})
export class ImageWidgetListComponent implements OnInit, OnChanges {

  @Input() imageWigets = [];
  @Input() localizations;

  @Output() ouptupEvent = new EventEmitter();

  showModal = false;

  modalData = {
    title: '',
    body: '',
    buttons: {
      yes: '',
      no: '',
      close: ''
    },
    iconClass: ''
  };

  // temp variable to hold current selected image object
  currentImg;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log(this.imageWigets);
  }

  selectImage(img) {
    if (img.AllowEditable) {
      console.log('emit event', img);
      this.ouptupEvent.emit({ type: 'SELECT_IMAGE_WIDGET', data: img });
    } else {
      console.log('unable to edit', img);
    }
  }

  deleteImage(img) {
    console.log(img);
    this.currentImg = img;
    this.modalData = {
      title: this.localizations.DELETE_GRAPHIC,
      body: this.localizations.ERROR_WIDGET_REMOVE_MESSAGE,
      buttons: {
        yes: this.localizations.YES_BUTTON,
        no: this.localizations.NO_BUTTON,
        close: this.localizations.CLOSE
      },
      iconClass: 'atf-warning'
    };
    this.showModal = true;
  }

  modelHandler(evt) {
    this.showModal = false;
    if (evt.data === 'yes') {
      console.log('emit event');
      this.imageWigets = this.imageWigets.filter( (r) => {
        return r.id !== this.currentImg.id;
      });
      this.ouptupEvent.emit({ type: 'DELETE_IMAGE_WIDGET', data: this.currentImg });
    }
  }
}

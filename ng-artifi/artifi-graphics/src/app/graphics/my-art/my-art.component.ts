import { Component, OnInit, ChangeDetectorRef, Input, EventEmitter, Output } from '@angular/core';
import { MyArtService } from './my-art.service';

@Component({
  selector: 'artifi-my-art',
  templateUrl: './my-art.component.html',
  styleUrls: ['./my-art.component.sass']
})
export class MyArtComponent implements OnInit {

  @Input() settings;
  @Input() localizations;
  @Output() outputEvents = new EventEmitter();

  currentImgId: 0;
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

  assetsList = [];

  constructor( private myArtService: MyArtService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.myArtService.settings = this.settings;
    this.myArtService.getUserPhotos(1).subscribe( (res) => {
      const dataArr = res['Data']['CategoryAssetsList'];
      dataArr.forEach( (data) => {
        this.assetsList = [...this.assetsList, ...data['AssetsList']];
        this.ref.detectChanges();
      });
    });
  }

  selectImage(imgData) {
    imgData.Source = 'photo';
    // imgData.Id = imgData.id;
    imgData.ThumbUrl = this.settings.myart.myartThumbUrl + imgData.UniqueName + imgData.Extension;
    imgData = {...imgData, ...{ srcOriginal: this.settings.myart.myartImagePath + imgData.UniqueName + imgData.Extension }};
    this.outputEvents.emit({ type: 'SELECT_CLIPART', data : imgData });
  }

  deleteUserPhoto(id) {
    this.currentImgId = id;
    this.modalData = {
      title: this.localizations.CONFIRM,
      body: this.localizations.ERROR_PHOTO_REMOVE_MESSAGE,
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
    console.log(evt);
    this.showModal = false;
    if (evt.data === 'Yes') {

      this.myArtService.deleteImage(this.currentImgId).subscribe( (res) => {
        console.log(res);
        this.modalData = {
          title: this.localizations.SAVE_SUCCESS,
          body: this.localizations.IMAGE_DELETED_SUCCESSFULLY,
          buttons: {
            yes: this.localizations.OK,
            no: '',
            close: this.localizations.CLOSE
          },
          iconClass: 'atf-checkmark'
        };
        this.showModal = true;
        this.assetsList = this.assetsList.filter( (r) => {
          return r.Id !== this.currentImgId ? r : '';
        });
        console.log(this.assetsList);
      }, (err) => {
        console.log(err);
        this.modalData = {
          title: this.localizations.SAVE_ERROR,
          body: this.localizations.ERROR_DRAFT_DELETE,
          buttons: {
            yes: this.localizations.OK,
            no: '',
            close: this.localizations.CLOSE
          },
          iconClass: 'atf-times-circle-o'
        };
        this.showModal = true;
      });
    }
  }

}



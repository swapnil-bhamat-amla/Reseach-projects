// tslint:disable:max-line-length

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UploadImageService } from '../../upload-image.service';

@Component({
  selector: 'artifi-instagram-upload',
  templateUrl: './instagram-upload.component.html',
  styleUrls: ['./instagram-upload.component.scss']
})
export class InstagramUploadComponent implements OnInit {

  @Input() settings;
  @Output() outputEvent = new EventEmitter();

  instaTimer;
  token;
  display;
  imagesList = [];
  selectedPic = {
    id: '',
    user: {
      id: '',
      full_name: '',
      profile_picture: '',
      username: ''
    },
    images: {
      thumbnail: { width: 0, height: 0, url: '' },
      low_resolution: { width: 0, height: 0, url: '' },
      standard_resolution: { width: 0, height: 0, url: '' }
    },
    created_time: '',
    caption: null,
    user_has_liked: false,
    likes: { count: 0 },
    tags: [],
    filter: '',
    comments: { count: 0 },
    type: '',
    link: '',
    location: null,
    attribution: null,
    users_in_photo: []
  };

  constructor(private cuService: UploadImageService) { }

  ngOnInit() {
    const instaWindow = window.open(
      this.settings.upload.instagram.apiEndpoint +
      '?client_id=' + this.settings.upload.instagram.client_id +
      '&redirect_uri=' + this.settings.upload.instagram.redirect_uri +
      '&response_type=' + this.settings.upload.instagram.response_type,
      '_new',
      'WIDTH=' + this.settings.upload.instagram.width +
      ',HEIGHT=' + this.settings.upload.instagram.height);

    this.instaTimer = setInterval( () => { this.checkToken(instaWindow.location.href, instaWindow); }, 2000);
  }

  checkToken(href, instaWindow) {
    if ( typeof href !== 'undefined' && href.indexOf('access_token') >= 0) {
      clearInterval(this.instaTimer);
      instaWindow.close();
      this.token = href.split('access_token=')[1];
      this.getUserImages();
    }
  }

  getUserImages() {
    this.cuService.getInstagramPics(this.token).subscribe( (r) => {
      this.processData(r);
    });
  }

  processData(data) {
    this.imagesList = data.data;
    this.openModal();
  }

  onCloseHandled() {
    this.display = 'none';
  }

  openModal() {
    this.display = 'block';
  }


  btnApply() {
    const data = [{
        FrontAppUserId: this.settings.frontAppUserId,
        WebsiteId: this.settings.websiteId,
        CompanyId: this.settings.companyId,
        CompanyPhysicalFolderName: this.settings.CompanyPhysicalFolderName,
        Scope: 'instagram',
        Width: this.selectedPic.images.standard_resolution.width,
        Height: this.selectedPic.images.standard_resolution.height,
        ImageName: this.selectedPic.id,
        OriginalImageUrl: this.selectedPic.images.standard_resolution.url,
        ImageScopeId: this.selectedPic.id
      }];

    this.cuService.uploadSocial(this.settings.upload.instagram.uploadURL, data).subscribe( (rtn) => {
      this.onCloseHandled();
      if (rtn['Response'] === 'Success') {
        this.outputEvent.emit({type: 'NAVIGATE', data: 'my-art'});
      } else {

      }
    });
  }

}

// tslint:disable:max-line-length

import { Component, OnInit, Input } from '@angular/core';
import { UploadImageService } from '../../upload-image.service';

declare var FB;

@Component({
  selector: 'artifi-facebook-upload',
  templateUrl: './facebook-upload.component.html',
  styleUrls: ['./facebook-upload.component.scss']
})

export class FacebookUploadComponent implements OnInit {

  @Input() settings;
  uid;
  accessToken;
  imagesList = [];
  display = 'none';
  selectedPic = {
    height: 0,
    id: '',
    picture: '',
    source: '',
    width: 0
  };


  constructor(private cuService: UploadImageService) {

  }

  ngOnInit() {

    FB.init({
      appId: this.settings.upload.facebook.appId,
      status: true,
      cookie: true,
      xfbml: true,
      version: 'v3.2'
    });
  }

  sample() {
    let _this = this;
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        // The user is logged in and has authenticated your
        _this.uid = response.authResponse.userID;
        _this.accessToken = response.authResponse.accessToken;
        _this.getUserPhotos();
      } else {
        // The user isn't logged in to Facebook. You can launch a
        // login dialog with a user gesture, but the user may have
        // to log in to Facebook before authorizing your application.
        this.FBlogin();
      }
    });
  }

  FBlogin() {
      const _this = this;
      FB.login( (response) => {
        if (response.authResponse) {
          _this.uid = response.authResponse.userID;
          _this.accessToken = response.authResponse.accessToken;
          FB.api('/' + response.authResponse.userID + '?fields=albums{name, photos{name, picture, source, width, height}}&height=130&width=174',
                  (rtn) => {
                    if (rtn && !rtn.error) {
                      _this.processData(rtn);
                    }
                  });
        } else {
        console.log('User login failed');
      }
    }, {scope: 'user_photos'});
  }

  getUserPhotos() {
    const _this = this;
    FB.api('/' + this.uid + '?fields=albums{name, photos{name, picture, source,width,height}}&height=130&width=174', (response) => {
      _this.processData(response);
    });
  }


  processData(data) {
    const unprocessedImgArr = data.albums.data;
    for ( let i of unprocessedImgArr ) {
      this.imagesList = [...this.imagesList, ...i.photos.data];
    }
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
        FrontAppUserId: this.settings.upload.facebook.appId,
        WebsiteId: this.settings.websiteId,
        CompanyId: this.settings.companyId,
        CompanyPhysicalFolderName: this.settings.CompanyPhysicalFolderName,
        Scope: 'facebook',
        Width: this.selectedPic.width,
        Height: this.selectedPic.height,
        ImageName: this.selectedPic.id,
        OriginalImageUrl: this.selectedPic.source,
        ImageScopeId: this.selectedPic.id
      }];

    this.cuService.uploadSocial(this.settings.upload.facebook.uploadURL, data).subscribe( (rtn) => {
      this.onCloseHandled();
      if (rtn['Response'] === 'Success') {

      } else {

      }
    });
  }
}

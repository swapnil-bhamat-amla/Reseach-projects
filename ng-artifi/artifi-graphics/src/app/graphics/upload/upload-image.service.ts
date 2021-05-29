// tslint:disable:max-line-length

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {

  settings;

  constructor(private http: HttpClient) { }

  uploadSingle(file) {
    return this.http.post(this.settings.upload.computer.uploadURL +
      '?frontAppUserId=' + this.settings.frontAppUserId +
      '&websiteId=' + this.settings.websiteId +
      '&companyId=' + this.settings.companyId +
      '&companyPhysicalFolderName=' + this.settings.CompanyPhysicalFolderName,
      file, {reportProgress: true, observe: 'events'});
  }

  uploadSocial(url, data) {

    const body = new HttpParams().set('ThirdPartyImageData', JSON.stringify(data));

    const headers = {
      headers: new HttpHeaders({
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    return this.http.post( url, body, headers);
  }


  getInstagramPics(token) {
    return this.http.get('https://api.instagram.com/v1/users/self/media/recent/?access_token=' + token);
  }

}

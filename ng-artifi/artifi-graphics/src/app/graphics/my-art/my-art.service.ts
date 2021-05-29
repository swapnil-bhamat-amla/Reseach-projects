// tslint:disable:max-line-length

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MyArtService {

  settings;

  constructor(private http: HttpClient) { }

  /* header generation */
  getHeaderOptions(pageId) {
    const settings = this.settings;
    settings.pageIndex = pageId ? pageId : 1;

    let headerKey = '?';
    const headerKeys = ['frontAppUserId', 'websiteId', 'pageIndex', 'pageSize', 'isDesigner'];

    for (const i in settings) {
      if (headerKeys.indexOf(i) !== -1) {
        headerKey += i + '=' + settings[i] + '&';
      }
    }

    return  {
      headers: new HttpHeaders({
        personalization: btoa(headerKey.slice(0, -1))
      })
    };
  }

  getUserPhotos(pageId) {
    return this.http.get(this.settings.myart.getPhotosUrl, this.getHeaderOptions(pageId));
  }

  getHeaderOptionsForDelete(id) {
    const settings = this.settings;

    let headerKey = '?userPhotoId=' + id + '&';
    const headerKeys = ['websiteId', 'webApiClientKey'];

    for (const i in settings) {
      if (headerKeys.indexOf(i) !== -1) {
        headerKey += i + '=' + settings[i] + '&';
      }
    }

    return  {
      headers: new HttpHeaders({
        personalization: btoa(headerKey.slice(0, -1))
      })
    };
  }

  deleteImage(id) {
    return this.http.get(this.settings.myart.deletePhotoUrl, this.getHeaderOptionsForDelete(id));
  }

}

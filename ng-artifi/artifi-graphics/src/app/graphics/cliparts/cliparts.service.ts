// tslint:disable:max-line-length

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';

const maxAge = 30000;

@Injectable({
  providedIn: 'root'
})
export class ClipartsService {

  httpOptions;
  settings;
  cache = new Map();
  constructor(private http: HttpClient) { }

    /* header generation */
    getHeaderOptions(pageId) {
      const settings = this.settings;
      settings.pageIndex = pageId ? pageId : 1;

      let headerKey = '?';
      const headerKeys = ['websiteId', 'divisionId', 'productId', 'webApiClientKey', 'sku', 'productCode', 'pageIndex', 'pageSize', 'isDesigner', 'isFirstLoad', 'folderId', 'ruleId', 'productViewId', 'templateId'];

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

  /* fetch cliparts data */
  getCliparts(pageId) {
    return this.http.get(this.settings.hostUrl + this.settings.clipartAction, this.getHeaderOptions(pageId));
  }






  get(req: HttpRequest<any>): HttpResponse<any> | undefined {
    const url = req.urlWithParams;
    const cached = this.cache.get(url);

    if (!cached) {
      return undefined;
    }

    const isExpired = cached.lastRead < (Date.now() - maxAge);
    const expired = isExpired ? 'expired ' : '';
    return cached.response;
  }

  put(req: HttpRequest<any>, response: HttpResponse<any>): void {
    const url = req.url;
    const entry = { url, response, lastRead: Date.now() };
    this.cache.set(url, entry);

    const expired = Date.now() - maxAge;
    this.cache.forEach(expiredEntry => {
      if (expiredEntry.lastRead < expired) {
        this.cache.delete(expiredEntry.url);
      }
    });
  }
}

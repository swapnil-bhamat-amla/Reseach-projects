import { Injectable } from '@angular/core';
import {
  HttpHandler,
  HttpProgressEvent,
  HttpInterceptor,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpUserEvent,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
export const CACHE_KEY = 'X-No-Cache';

@Injectable()
export class NoCacheInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

    const noCache = req.headers.get(CACHE_KEY);
    if (!noCache) {
      console.log('noCache -- found');
      return next.handle(req);
    }

    const nextReq = req.clone({
      headers: req.headers.delete(CACHE_KEY)
    }).clone({
      setHeaders: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT',
        'If-Modified-Since': '0'
      }
    });

    return next.handle(nextReq);
  }
}

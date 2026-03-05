import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import {UtilsService} from "../services/utils.service";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  userId: number | undefined;

  constructor(private utilsService: UtilsService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // base headers
    let headers = req.headers.set('Accept', 'application/json');

    const accesToken = this.utilsService.getUserToken();
    const user = this.utilsService.getUserConnected();

    if (accesToken && !req.url.includes('login')) {
      headers = headers.set('Authorization', `Bearer ${accesToken}`);
      if (req.headers.has('enctype')) {
        headers = headers.set('enctype', 'multipart/form-data');
      } else {
        headers = headers.set('Content-Type', 'application/json');
      }

      if (user?.id) {
        headers = headers.set('ParcUserId', user.id.toString());
      }
    }

    const clonedReq = req.clone({ headers });
    return next.handle(clonedReq);
  }

}

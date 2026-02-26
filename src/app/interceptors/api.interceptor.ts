import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import {UtilsService} from "../services/utils.service";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  userId: number | undefined;

  constructor(private utilsService: UtilsService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const defaultBaseUrl = req.clone({ url: `${req.url}` });

    // ajout du token bearer a lentete avant de poursuivre la requete
    let accesToken: any = this.utilsService.getUserToken() ;

    if(this.utilsService.getUserConnected()){
      this.userId = this.utilsService.getUserConnected()?.id;
    }

    if (accesToken) {
      let clone: HttpRequest<any>;

      if(req.headers.has('enctype')) {
        clone = req.clone({
          setHeaders: {
            Accept: `application/json`,
            'enctype': 'multipart/form-data',
            Authorization: `Bearer ${accesToken}`
          }
        });
      } else {
        clone = req.clone({
          setHeaders: {
            Accept: `application/json`,
            'Content-Type': `application/json`,
            Authorization: `Bearer ${accesToken}`
          }
        });
      }
      // user id
      if(this.userId) {
        clone = clone.clone({
          headers: clone.headers.set('ParcUserId', this.userId.toString())
        });
      }
      return next.handle(clone);
    }

    return next.handle(defaultBaseUrl);

  }

}

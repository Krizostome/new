import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {UtilsService} from "./utils.service";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private utilsService: UtilsService) { }

  authenticate(item: any): Observable<any> {
    return this.http.post(environment.BASE_URL + 'login', JSON.stringify(item), this.utilsService.getHttpPostHeaderForResource());

  }

}

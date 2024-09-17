import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UtilsService} from "./utils.service";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class JournalSmsService {

  constructor(private http: HttpClient, private utilsService: UtilsService) { }

  searchSMS(data: any): Observable<any> {
    return this.http.post(environment.BASE_URL + 'journal-sms/search', JSON.stringify(data), this.utilsService.getHttpPostHeaderForResource());
  }

  getAllSMS(): Observable<any> {
    return this.http.get(environment.BASE_URL + 'journal-sms/list', {});
  }

}

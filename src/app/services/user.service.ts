import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import {UtilsService} from "./utils.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private utilsService: UtilsService) { }

  getUserByUsername(mail: string): Observable<any> {
    const searchUserForm: any = {
      email: mail
    };
    return this.http.post(environment.BASE_URL + 'user/load-by-email', searchUserForm);
  }

  getUserById(userId: any):Observable<any>{
    return this.http.get(environment.BASE_URL+ 'parc/get-user-by-id/'+userId, {});
  }

  getListUser(): Observable<any>{
    return this.http.get(environment.BASE_URL + "parc/getAllUser", {});
  }


  updateUser(data: any){
    return this.http.post(environment.BASE_URL + "parc/user/update", JSON.stringify(data), this.utilsService.getHttpPostHeaderForResource());
  }

  deleteUser(body: any): Observable<any> {
    const objet={
      user_id:body
    }
    return this.http.post(environment.BASE_URL + 'parc/user/delete', JSON.stringify(body),this.utilsService.getHttpPostHeaderForResource());
  }

}

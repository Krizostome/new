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
    return this.http.get(environment.BASE_URL+ 'user/get/'+userId, {});
  }

  getListUser(): Observable<any>{
    return this.http.get(environment.BASE_URL + "user/all", {});
  } 

  getListRole(): Observable<any>{
    return this.http.get(environment.BASE_URL + "user/roles", {});
  } 


  saveUser(data: any){
    return this.http.post(environment.BASE_URL + "user/save", data);
  }



  updateUser(data: any){
    return this.http.post(environment.BASE_URL + "user/update", data);
  }

  deleteUser(userId: any): Observable<any> {
    const data = {
      user_id: userId
    };
    return this.http.post(environment.BASE_URL + 'user/delete', data);
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UtilsService } from './utils.service';


@Injectable({
  providedIn: 'root',
})
export class EntiteService {

  constructor(private http: HttpClient, private utilsService: UtilsService) { }

  getEntites(): Observable<any> {
    return this.http.get(environment.BASE_URL + 'entites', {});
  }

  getEntiteById(entiteId: any):Observable<any>{
    return this.http.get(environment.BASE_URL+ 'entites/'+entiteId, {});
  }

  saveEntites(body: any): Observable<any> {
    return this.http.post(environment.BASE_URL + 'entites', body);
  } 

 updateEntite(entiteId: any, data: any){
    return this.http.put(environment.BASE_URL + "entites/" + entiteId, data);
 }

 deleteEntite(entiteId: any): Observable<any> {
    return this.http.delete(environment.BASE_URL + "entites/" + entiteId, {});
  }

} 

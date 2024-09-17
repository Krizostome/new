import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class PlanningGardeService {
  
  blobHttpOptions = {
    responseType: 'blob' as 'json'
  };

  constructor(private http: HttpClient, private utilsService: UtilsService) { }

  getPlanningGardes(): Observable<any> {
    return this.http.get(environment.BASE_URL + 'chauffeur/list/planning-gardes', {});
  }

  deletePlanningGarde(planningId: number): Observable<any> {
    return this.http.get(environment.BASE_URL + 'chauffeur/delete/planning-garde/'+planningId, {});
  }

  savePlanningGarde(body: any): Observable<any> {
    return this.http.post(environment.BASE_URL + 'chauffeur/save/planning-garde', {body});
  }

  getPlanningGardeById(planningId: number): Observable<any> {
    return this.http.get(environment.BASE_URL + 'chauffeur/get-planning-by-id/' +planningId, {});
  }

  downloadPlanning(body: any) {
    return this.http.post(environment.BASE_URL +'chauffeur/download-planning', body, this.blobHttpOptions);
  }

  generatePlanning(body: any) {
    return this.http.post(environment.BASE_URL +'chauffeur/download-planning', body);
  }

}

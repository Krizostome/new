import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class ChauffeursService {
  constructor(private http: HttpClient, private utilsService: UtilsService) { }

  getChauffeurs(): Observable<any> {
    return this.http.get(environment.BASE_URL + 'chauffeur/list', {});
  }

  saveChauffeur(body: any): Observable<any> {
    return this.http.post(environment.BASE_URL + 'chauffeur/save', body);
  }

  getChauffeurById(chauffeurId: number): Observable<any> {
    return this.http.get(environment.BASE_URL + 'chauffeur/get-chauffeur-by-id/' +chauffeurId, {});
  }

  getListAgents(): Observable<any> {
    return this.http.get(environment.BASE_URL + 'chauffeur/list-agents', {});
  }

}

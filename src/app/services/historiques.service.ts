import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class HistoriquesService {

  blobHttpOptions = {
    responseType: 'blob' as 'json'
  };
  
  constructor(private http: HttpClient, private utilsService: UtilsService) { }

  getDirections(): Observable<any> {
    return this.http.get(environment.BASE_URL + 'historiques/list-directions', {});
  }
  
  getHistoriquesDemandes(body: any): Observable<any> {
    return this.http.post(environment.BASE_URL + 'historiques/get-historique-demandes', {body});
  }
  
  exportHistoriquesDemandes(body: any) {
    return this.http.post(environment.BASE_URL +'historiques/export-historique-demandes', body, this.blobHttpOptions);
  }
  
  getHistoriquesPerformancesChauffeurs(body: any): Observable<any> {
    return this.http.post(environment.BASE_URL + 'historiques/get-historique-performaces-chauffeur', {body});
  }
  
  exportPerformancesChauffeur(body: any) {
    return this.http.post(environment.BASE_URL +'historiques/export-performances-chauffeur', body, this.blobHttpOptions);
  }

}

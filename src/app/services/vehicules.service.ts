import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehiculesService {
  constructor(private http: HttpClient ) { }

  getListVehicules(): Observable<any> {
    return this.http.get(environment.BASE_URL + 'vehicule/list', {});
  }

  getTypesVehicules(): Observable<any> {
    return this.http.get(environment.BASE_URL + 'vehicule/type', {});
  }

  getCategoriePermis(): Observable<any> {
    return this.http.get(environment.BASE_URL + 'vehicule/categorie-permis', {});
  }

  getVehiculeById(vehiculeId: number): Observable<any> {
    return this.http.get(environment.BASE_URL + 'vehicule/get/' +vehiculeId, {});
  }

  saveVehicule(body: any): Observable<any> {
    return this.http.post(environment.BASE_URL + 'vehicule/save', body);
  }

  saveTypeVehicule(body: any): Observable<any> {
    return this.http.post(environment.BASE_URL + 'vehicule/save-type', body);
  }

  saveCategoriePermis(body: any): Observable<any> {
    return this.http.post(environment.BASE_URL + 'vehicule/save-categorie-permis', body);
  }

  saveConduire(body: any): Observable<any> {
    return this.http.post(environment.BASE_URL + 'vehicule/save-conduire', body);
  }

  deleteConduire(body: any): Observable<any> {
    return this.http.post(environment.BASE_URL + 'vehicule/delete-conduire', body);
  }

  deleteVehicule(id: number) {
  return this.http.delete(environment.BASE_URL + 'vehicule/vehicules/' +id);
}

}

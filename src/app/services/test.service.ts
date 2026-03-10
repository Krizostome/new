import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private apiUrl = 'http://localhost:8000/api'; // URL de ton API Laravel

  constructor(private http: HttpClient) {}

  getMotifs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/motifs`);
  }

  getTypeVehicules(): Observable<any> {
    return this.http.get(`${this.apiUrl}/typevehicules`);
  }
}
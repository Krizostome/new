import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {UtilsService} from "./utils.service";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DemandesCoursesService {


  constructor(private http: HttpClient, private utilsService: UtilsService) { }
  getAllDemandesDeCoursesEnCour(userId: any,role: any): Observable<any> {
    return this.http.get(environment.BASE_URL+'parc/list/demande-courses-en-cour/' +userId+'/'+role,{});
  }
  searchDemandeCourseEncour(data: any):Observable<any> {
    return this.http.post(environment.BASE_URL+'parc/list/demande-courses-en-cour-filtrer',JSON.stringify(data),this.utilsService.getHttpPostHeaderForResource());
  }
  getAllDemandesDeCourses(userId: any, role: any): Observable<any> {
    return this.http.get(environment.BASE_URL + 'parc/list/demande-courses/' +userId +'/' +role, {});
  }

  getAllTypesVehicules(): Observable<any> {
    return this.http.get(environment.BASE_URL + 'vehicule/type', {});
  }


  getAllMotifs(): Observable<any> {
    return this.http.get(environment.BASE_URL + 'parc/motif', {});
  }

  saveDemandeCourse(demandeCourse: any): Observable<any> {
    return this.http.post(environment.BASE_URL + 'parc/save/demande-courses', JSON.stringify(demandeCourse), this.utilsService.getHttpPostHeaderForResource());
  }

  searchDemandeCourse(demandeCourse: any): Observable<any> {
    return this.http.post(environment.BASE_URL + 'parc/filter', JSON.stringify(demandeCourse), this.utilsService.getHttpPostHeaderForResource());
  }

  editDemandeCourse(demandeCourse: any): Observable<any> {
    return this.http.post(environment.BASE_URL + 'chauffeur/edit/demande-course', JSON.stringify(demandeCourse), this.utilsService.getHttpPostHeaderForResource());
  }

  deleteDemandeCourse(data: any) {
    return this.http.post(environment.BASE_URL + 'chauffeur/delete/demande-course', JSON.stringify(data),  this.utilsService.getHttpPostHeaderForResource());
  }

  getDemandeCourseById(demandeId: number): Observable<any> {
    return this.http.get(environment.BASE_URL + 'chauffeur/get-demande-by-id/' +demandeId, {});
  }

  getVehiculesByType(typeId: number, demandeId: number): Observable<any> {
    return this.http.get(environment.BASE_URL + 'parc/affecter/demande-courses/' +typeId+ '/' +demandeId, {});
  }

  affecterCourse(affectation: any): Observable<any> {
    return this.http.post(environment.BASE_URL + 'parc/affecter/demande-courses', JSON.stringify(affectation), this.utilsService.getHttpPostHeaderForResource());
  }

  updateAffectationCourse(affectation: any): Observable<any> {
    return this.http.post(environment.BASE_URL + 'parc/affecter/update', JSON.stringify(affectation), this.utilsService.getHttpPostHeaderForResource());
  }

  getListDemandeAffecter(): Observable<any>{
    return this.http.get(environment.BASE_URL + 'liste-demande-affecter', {});
  }

  demarrerCourse(idCourse:number):Observable<any>{
    return this.http.get(environment.BASE_URL+'chauffeur/demande-courses/demarer/'+idCourse,{});

  }
  arreterCourse(idCourse:number):Observable<any>{
    return this.http.get(environment.BASE_URL+'chauffeur/demande-courses/arreter/'+idCourse,{})
  }

  verifiedChauffeur(chauffeurSelected:any, demandeCourseId: number): Observable<any>{
    return this.http.get(environment.BASE_URL+'chauffeur/verify-chauffeur/'+chauffeurSelected +'/' +demandeCourseId, {});
  }

  checkVehiculeSeats(demandeCourseId: number): Observable<any>{
    return this.http.get(environment.BASE_URL+'parc/verify-seats/' +demandeCourseId, {});
  }

  checkNotNotedCourseFromUser(userId: any): Observable<any>{
    return this.http.get(environment.BASE_URL+'parc/verifierNotation/' +userId, {});
  }
}

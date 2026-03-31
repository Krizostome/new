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
    return this.http.post(environment.BASE_URL+'parc/list/demande-courses-en-cour-filtrer', data);
  }
  getAllDemandesDeCourses(userId: any, role: any): Observable<any> {
    return this.http.get(environment.BASE_URL + 'parc/list/demande-courses/' +userId +'/' +role, {});
  }

  getAllTypesVehicules(): Observable<any> {
    return this.http.get(environment.BASE_URL + 'parc/typevehicule', {});
  }


  getAllMotifs(): Observable<any> {
    return this.http.get(environment.BASE_URL + 'parc/motif', {});
  }

  saveDemandeCourse(demandeCourse: any): Observable<any> {
    return this.http.post(environment.BASE_URL + 'demande/save', demandeCourse);
  }

  searchDemandeCourse(demandeCourse: any): Observable<any> {
    return this.http.post(environment.BASE_URL + 'parc/filter', demandeCourse);
  }

  editDemandeCourse(demandeCourse: any): Observable<any> {
    return this.http.post(environment.BASE_URL + 'demande/edit/', demandeCourse);
  }

  deleteDemandeCourse(data: any) {
    return this.http.post(environment.BASE_URL + 'chauffeur/delete/demande-course', data);
  }

  getDemandeCourseById(demandeId: number): Observable<any> {
    return this.http.get(environment.BASE_URL + 'demande/get/' +demandeId, {});
  }

  getVehiculesByType(typeVehiculeId: number, demandeId: number): Observable<any> {
    return this.http.get(environment.BASE_URL + 'affectation/attributs/' +typeVehiculeId+ '/' +demandeId, {});
  }

  affecterCourse(affectation: any): Observable<any> {
    return this.http.post(environment.BASE_URL + 'parc/affecter/demande-courses', affectation);
  } 

  updateAffectationCourse(affectation: any): Observable<any> {
    return this.http.post(environment.BASE_URL + 'parc/affecter/update', affectation);
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

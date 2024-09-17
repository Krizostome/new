import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UtilsService } from './utils.service';
import { CritereNotation} from '../models/critere-notation';
import { env } from 'process';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpClient, private utilsService: UtilsService) { }

  getCritereDeNotation():Observable<any>{
    return this.http.get(environment.BASE_URL+"parc/criterDeNotation/getCritereNotation",{});
  }
  postNewNotes(data:any):Observable<any>{
    
    return this.http.post(environment.BASE_URL+"parc/note/newNote",{data});
  }
  getNotationByIdDemande(id:number):Observable<any>{
    return this.http.get(environment.BASE_URL+"parc/note/getNote/"+id,{});
    
  }
 
}

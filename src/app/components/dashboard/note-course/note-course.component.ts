import { Component, OnInit } from '@angular/core';
import { UntypedFormControl,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { range } from 'rxjs';
import { CritereNotation } from 'src/app/models/critere-notation';
import { DemandeVehicule } from 'src/app/models/demande-vehicule';
import { Notation } from 'src/app/models/notation';
import { DemandesCoursesService } from 'src/app/services/demandes-courses.service';
import { NoteService } from 'src/app/services/note.service';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';
import {User} from "../../../models/user";

@Component({
    standalone: false,
    selector: 'app-note-course',
    templateUrl: './note-course.component.html',
    styleUrls: ['./note-course.component.css'],
})
export class NoteCourseComponent implements OnInit {

  critereDeNotations= new Array<CritereNotation>();
  demandeId:number=0;
  demandeCourse: DemandeVehicule = new DemandeVehicule();
  commentaire=new UntypedFormControl(' ');
  notation=new Notation();
  ligneNotations:any ={};
  config:NgbRatingConfig;
  user: User | null = new User();

  constructor(private activatedRoute: ActivatedRoute,config: NgbRatingConfig,private noteService:NoteService, private ngxService: NgxUiLoaderService,private utilsService: UtilsService,
    private router: Router,private demandesCoursesService: DemandesCoursesService) {
    config.max=5;
    config.readonly=true;

    this.config=config;
  }

  ngOnInit(): void {
    this.user = this.utilsService.getUserConnected();
    this.getParamValue();
    this.getCritereDeNotation();
  }
  modifierCommentaire():void{

  }

  getParamValue(): void {
    this.demandeId = this.activatedRoute.snapshot.params["demandeId"]
    this.getDemandeById(this.demandeId);

  }

  getDemandeById(demandeId: any){
    this.ngxService.start();
    this.demandesCoursesService.getDemandeCourseById(demandeId).subscribe({
      next: value =>{
        if(value.data !== null){
          this.demandeCourse = value.data;
          if(this.demandeCourse.statut!=environment.STATUT_DEMANDE_COURSE_TERMINEE){
            this.router.navigate(['/demande/encours']);
            this.utilsService.showErreurMessage('Erreur','Course non terminée');
          }
          if(this.demandeCourse?.is_note){
            this.noteService.getNotationByIdDemande(this.demandeCourse.id).subscribe({
              next : value=>{
                this.notation=value.data[0];
                const ligne=value.data[1];
                ligne.forEach((element: { critere_notation_id: string | number; }) => {
                  this.ligneNotations[element.critere_notation_id]=element;


                });
                this.config.readonly=true;

              }
            });
          }else{
            this.config.readonly=false;
          }
        }
        this.ngxService.stop();
      },
      error: err =>{
        this.ngxService.stop();
        this.utilsService.handleError(err);
      },
      complete: () => {
        this.ngxService.stop();
      }
    });
  }

  getCritereDeNotation():void{
    this.ngxService.start();
    this.noteService.getCritereDeNotation().subscribe({
      next: value => {
        if (value && value.data) {
        this.critereDeNotations = value.data;

      } else {
        this.critereDeNotations = [];
      }
      var i:number;
      for(i=0;i<this.critereDeNotations.length;i++){
        this.critereDeNotations[i].stars=new UntypedFormControl(0);
      }

      this.ngxService.stop();
    },
    error: err => {
      this.ngxService.stop();
      this.utilsService.handleError(err);
    },
    complete: () => {

      this.ngxService.stop();
    }
  });
  }
  saveNote(){
    this.ngxService.start();

    var data:any={};

    data.notes=this.critereDeNotations;
    data.demandeId=this.demandeId;
    data.commentaire=this.commentaire.value;
    data.user_id = this.user?.id;

    this.noteService.postNewNotes(data).subscribe({
      next: value => {

        this.utilsService.showSuccessMessage("La course a été notée avec succès");

        this.ngxService.stop();
        this.router.navigate(['/demande/encours']);

      },
      error: err => {

        this.utilsService.showErreurMessage(err.status,err.error.message);
        this.ngxService.stop();
        this.utilsService.handleError(err);
      },
      complete: () => {
        this.ngxService.stop();
      }
    })




  }

}

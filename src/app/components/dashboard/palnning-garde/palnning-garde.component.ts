import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { French } from 'src/app/models/french';
import { Chauffeur } from 'src/app/models/chauffeur';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';
import { PlanningGardeService } from 'src/app/services/planning.garde.service';

@Component({
    standalone: false,
    selector: 'app-palnning-garde',
    templateUrl: './palnning-garde.component.html',
    styleUrls: ['./palnning-garde.component.css'],
})
export class PalnningGardeComponent implements OnInit {
  listeChauffeurs: any;  closeResult: any; chauffeur: Chauffeur = new Chauffeur; disponibilites: any = environment.DISPONIBILITE_CHAUFFEUR;
  public dtOptions: DataTables.Settings = {}; 
  public dtTrigger: Subject<any> = new Subject<any>();
  types_chauffeurs: any;


  listePlanningGardes: any; planning: any; chauffeurs: any;
  printForm: boolean = false;
  pdfUrl: string = "";


  constructor(private planninGardeService: PlanningGardeService, private ngxService: NgxUiLoaderService, private router: Router,
      private toastr: ToastrService, private utilsService: UtilsService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.setFrenchLanguageToDataTable();
    this.getListPlanningGardes();
  }

  getListPlanningGardes(): void {
    this.ngxService.start();
    this.planninGardeService.getPlanningGardes().subscribe({
      next: value => {
        if (value !== null && value.data !== null) {
          this.listePlanningGardes = value.data;
          this.dtTrigger.next(undefined);
        } else {
          this.listeChauffeurs = [];
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

  deleteChauffeurProgrammer(programmer: any){

  }

  savePlanningGarde(): void {
    this.ngxService.start();    
    this.planninGardeService.savePlanningGarde(this.chauffeur).subscribe({
      next: value => {
        this.utilsService.showSuccessMessage(value.message);        
        this.chauffeur = value.data;
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
    
  deletePlanningGarde(): void {
    this.ngxService.start();    
    this.planninGardeService.deletePlanningGarde(this.planning.id).subscribe({
      next: value => {
        this.utilsService.showSuccessMessage(value.message);
        this.ngxService.stop();    
        $('#bootstrap-data-table1').DataTable().ajax.reload();
        this.ngOnInit();
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

  jumpToPlanningGardeEdit(planningId: number) {
    this.router.navigate(['/planning-garde/modifier/'+planningId]);
  }

  jumpToChauffeurDetails(chauffeurId: number) {
    this.router.navigate(['/chauffeur/details/'+chauffeurId]);
  }

  setFrenchLanguageToDataTable(): void {
    this.dtOptions = {
      language : French.dataTableFrench
    };
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.dtTrigger.next(undefined);
  }

  
  listeChauffeursDeGarde(content:any, planning: any) {
    this.planning  = planning;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  
  deletePlanningConfirmation(content:any, planning: any) {
    this.planning = planning;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  
  downloadFacture(planning: any) {
    this.ngxService.start();
    this.planninGardeService.downloadPlanning({'planning_garde_id':planning.id}).subscribe(
      (data: any) => {
        this.ngxService.stop();
        let blob = new Blob([data], { type: 'application/pdf' });
        let downloadURL = window.URL.createObjectURL(data);
        let link = document.createElement('a');
        link.href = downloadURL;
        link.download = "PlanningGarde"+planning.id+".pdf";
        link.click();
      },
      (err: any) => {        
        this.ngxService.stop();
        this.utilsService.handleError(err);
      })
  }

  //Génération apercu facture  
  generateApercu(planning: any) {
    this.ngxService.start();
    console.log(planning);
    this.planninGardeService.generatePlanning({'planning_garde_id':planning.id}).subscribe(
      (response: any) => { 
        this.ngxService.stop();
        if (response.data['planning_garde_id']){
          this.displayApercu(response.data['planning_garde_id']);
        } else {
          this.printForm = false
        }
      },
      (err: any) => {
        this.ngxService.stop();
        this.utilsService.handleError(err);
      })
  }

  displayApercu(planning_id: any) {
    this.pdfUrl = environment.BASE_URL+'chauffeur/get-planning-path/'+planning_id;
    $('#pdfIframe').attr('src',this.pdfUrl);
    this.printForm = true;
  }

  closeApercu(){
    this.printForm = false;
  }

}

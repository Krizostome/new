import { DatePipe } from '@angular/common';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { French } from 'src/app/models/french';
import { Chauffeur } from 'src/app/models/chauffeur';
import { ChauffeursService } from 'src/app/services/chauffeurs.service';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';

@Component({
    standalone: false,
    selector: 'app-chauffeurs',
    templateUrl: './chauffeurs.component.html',
    styleUrls: ['./chauffeurs.component.css'],
})
export class ChauffeursComponent implements OnInit {

  listeChauffeurs: any;  closeResult: any; chauffeur: Chauffeur = new Chauffeur; disponibilites: any = environment.DISPONIBILITE_CHAUFFEUR;
  public dtOptions: DataTables.Settings = {}; 
  public dtTrigger: Subject<any> = new Subject<any>();
  types_chauffeurs: any;

  constructor(private chauffeursService: ChauffeursService, private ngxService: NgxUiLoaderService, private router: Router,
      private toastr: ToastrService, private utilsService: UtilsService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.setFrenchLanguageToDataTable();
    this.getListchauffeurs();
  }

  getListchauffeurs(): void {
    this.ngxService.start();
    this.chauffeursService.getChauffeurs().subscribe({
      next: value => {
        if (value && value.data) {
          this.listeChauffeurs = value.data;
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

  saveChauffeur(): void {
    this.ngxService.start();    
    this.chauffeursService.saveChauffeur(this.chauffeur).subscribe({
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
    
  deleteChauffeur(chauffeur: Chauffeur): void {
    this.ngxService.start();    
    this.chauffeur.statut = false;
    this.chauffeursService.saveChauffeur(chauffeur).subscribe({
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
  
  setDisponobiliteChauffeur(): void {
    this.ngxService.start();    
    this.chauffeursService.saveChauffeur(this.chauffeur).subscribe({
      next: value => {
        this.utilsService.showSuccessMessage(value.message);
        this.ngxService.stop();    
        $('#bootstrap-data-table1').DataTable().ajax.reload();
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

  jumpToChauffeurEdit(chauffeurId: number) {
    this.router.navigate(['/chauffeur/modifier/'+chauffeurId]);
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

  
  open_lg(content:any, chauffeur: any) {
    this.chauffeur = chauffeur;
    console.log(this.chauffeur);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}

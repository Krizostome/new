import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { French } from 'src/app/models/french';
import { Vehicule } from 'src/app/models/vehicule';
import { VehiculesService } from 'src/app/services/vehicules.service';
import { UtilsService } from 'src/app/services/utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
    standalone: false,
    selector: 'app-vehicules',
    templateUrl: './vehicules.component.html',
    styleUrls: ['./vehicules.component.css'],
})
export class VehiculesComponent implements OnInit {

  listeVehicules: any;  closeResult: any; vehicule: Vehicule = new Vehicule; disponibilites: any = environment.DISPONIBILITE_VEHICULE;
  public dtOptions: DataTables.Settings = {}; 
  public dtTrigger: Subject<any> = new Subject<any>();
  types_vehicules: any;

  constructor(private vehiculesService: VehiculesService, private ngxService: NgxUiLoaderService, private router: Router,
      private toastr: ToastrService, private utilsService: UtilsService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.setFrenchLanguageToDataTable();
    this.getListVehicules();
    this.getTypesVehicules();
  }

  getListVehicules(): void {
    setTimeout(() => this.ngxService.start());
    this.vehiculesService.getListVehicules().subscribe({
      next: value => {
        if (value && value.data) {
          this.listeVehicules = value.data;
          this.dtTrigger.next(undefined);
        } else {
          this.listeVehicules = [];
        }
        setTimeout(() => this.ngxService.stop());
      },
      error: err => {
        setTimeout(() => this.ngxService.stop());
        this.utilsService.handleError(err);
      },
      complete: () => {
        setTimeout(() => this.ngxService.stop());
      }
    });
  }

  getTypesVehicules(): void {
    setTimeout(() => this.ngxService.start());
    this.vehiculesService.getTypesVehicules().subscribe({
      next: value => {
        this.types_vehicules = value.data;
        setTimeout(() => this.ngxService.stop());
      },
      error: err => {
        setTimeout(() => this.ngxService.stop());
        this.utilsService.handleError(err);
      },
      complete: () => {
        setTimeout(() => this.ngxService.stop());
      }
    });
  }

  saveVehicule(): void {
    setTimeout(() => this.ngxService.start());
    this.vehiculesService.saveVehicule(this.vehicule).subscribe({
      next: value => {
        this.utilsService.showSuccessMessage(value.message);        
        this.vehicule = value.data;
        setTimeout(() => this.ngxService.stop());
      },
      error: err => {
        setTimeout(() => this.ngxService.stop());
        this.utilsService.handleError(err);
      },
      complete: () => {
        setTimeout(() => this.ngxService.stop());
      }
    });
  }
  
  setDisponobiliteVehicule(): void {
    setTimeout(() => this.ngxService.start());
    this.vehiculesService.saveVehicule(this.vehicule).subscribe({
      next: value => {
        this.utilsService.showSuccessMessage(value.message);
        setTimeout(() => this.ngxService.stop());
        $('#bootstrap-data-table1').DataTable().ajax.reload();
      },
      error: err => {
        setTimeout(() => this.ngxService.stop());
        this.utilsService.handleError(err);
      },
      complete: () => {
        setTimeout(() => this.ngxService.stop());
      }
    });
  }
  
  deleteVehicule(vehicule: Vehicule): void {
    setTimeout(() => this.ngxService.start());
    this.vehicule.statut = false;
    this.vehiculesService.saveVehicule(vehicule).subscribe({
      next: value => {
        this.utilsService.showSuccessMessage(value.message);
        setTimeout(() => this.ngxService.stop());
        $('#bootstrap-data-table1').DataTable().ajax.reload();
        this.ngOnInit();
      },
      error: err => {
        setTimeout(() => this.ngxService.stop());
        this.utilsService.handleError(err);
      },
      complete: () => {
        setTimeout(() => this.ngxService.stop());
      }
    });
  }

  jumpToVehiculeEdit(vehiculeId: number) {
    this.router.navigate(['/vehicule/modifier/'+vehiculeId]);
  }

  jumpToVehiculeDetails(vehiculeId: number) {
    this.router.navigate(['/vehicule/details/'+vehiculeId]);
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

  
  open_lg(content:any, v: any) {
    this.vehicule = v; this.vehicule.id = v.id; 
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

}

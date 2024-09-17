import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UtilsService } from 'src/app/services/utils.service';
import { VehiculesService } from 'src/app/services/vehicules.service';

@Component({
  selector: 'app-details-vehicule',
  templateUrl: './details-vehicule.component.html',
  styleUrls: ['./details-vehicule.component.css']
})
export class DetailsVehiculeComponent implements OnInit {
  vehiculeId: any;
  vehicule: any; closeResult: any; categorie_permis: any; list_categorie_permis: any; conduire: any; _conduire: any = {'categorie_permis_id': 0, 'vehicule_id': 0};

  constructor(private vehiculesService: VehiculesService, private ngxService: NgxUiLoaderService,private modalService: NgbModal,
    private utilsService: UtilsService, private activatedRoute: ActivatedRoute, private router: Router) { }
  
  ngOnInit(): void {
    this.getParamValue();
    this.getCategoriePermis();
  }

  getParamValue(): void {
    this.vehiculeId = this.activatedRoute.snapshot.params["vehiculeId"]
    this.getVehiculeById(this.vehiculeId);
  }

  getVehiculeById(vehiculeId: any){
    this.ngxService.start();
    this._conduire.vehicule_id = vehiculeId;
    this.vehiculesService.getVehiculeById(vehiculeId).subscribe({
      next: value =>{
        if(value.data !== null){
          this.vehicule = value.data;
          this.conduire = this.vehicule.conduire[0]?.pivot;
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
  
  getCategoriePermis(): void {
    this.vehiculesService.getCategoriePermis().subscribe({
      next: value => {
        this.list_categorie_permis = value.data;
      },
      error: err => {
        this.utilsService.handleError(err);
      },
      complete: () => {
      }
    });
  }
  
  saveCategoriePermis(): void {
    this.vehiculesService.saveCategoriePermis(this.categorie_permis).subscribe({
      next: value => {
        this.list_categorie_permis = value.data;
      },
      error: err => {
        this.utilsService.handleError(err);
      },
      complete: () => {
      }
    });
  }
  
  saveConduire(): void {
    this.ngxService.start();
    this.vehiculesService.saveConduire(this._conduire).subscribe({
      next: value => {
        this.ngxService.stop();
        this.utilsService.showSuccessMessage(value.message);
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
  
  deleteConduire(conduire: any): void {
    this.ngxService.start();
    this.vehiculesService.deleteConduire(conduire).subscribe({
      next: value => {
        this.ngxService.stop();
        this.utilsService.showSuccessMessage(value.message);
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
  

  jumpToVehiculeEdit(vehiculeId: number) {
    this.router.navigate(['/vehicule/modifier/'+vehiculeId]);
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

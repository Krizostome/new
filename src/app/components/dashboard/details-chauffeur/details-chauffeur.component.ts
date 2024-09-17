import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UtilsService } from 'src/app/services/utils.service';
import { ChauffeursService } from 'src/app/services/chauffeurs.service';

@Component({
  selector: 'app-details-chauffeur',
  templateUrl: './details-chauffeur.component.html',
  styleUrls: ['./details-chauffeur.component.css']
})
export class DetailsChauffeurComponent implements OnInit {
  chauffeurId: any;
  chauffeur: any; closeResult: any; categorie_permis: any; list_categorie_permis: any; conduire: any; _conduire: any = {'categorie_permis_id': 0, 'chauffeur_id': 0};

  constructor(private ChauffeursService: ChauffeursService, private ngxService: NgxUiLoaderService,private modalService: NgbModal,
    private utilsService: UtilsService, private activatedRoute: ActivatedRoute, private router: Router) { }
  
  ngOnInit(): void {
    this.getParamValue();
  }

  getParamValue(): void {
    this.chauffeurId = this.activatedRoute.snapshot.params["chauffeurId"]
    this.getChauffeurById(this.chauffeurId);
  }

  getChauffeurById(chauffeurId: any){
    this.ngxService.start();
    this._conduire.chauffeur_id = chauffeurId;
    this.ChauffeursService.getChauffeurById(chauffeurId).subscribe({
      next: value =>{
        if(value.data !== null){
          this.chauffeur = value.data;
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
  
  jumpToChauffeurEdit(chauffeurId: number) {
    this.router.navigate(['/chauffeur/modifier/'+chauffeurId]);
  }

}

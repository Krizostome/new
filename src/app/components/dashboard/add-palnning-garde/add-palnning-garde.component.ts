import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { CategoriePermis } from 'src/app/models/categorie-permis';
import { Chauffeur } from 'src/app/models/chauffeur';
import { PlannigGarde } from 'src/app/models/plannig-garde';
import { ChauffeursService } from 'src/app/services/chauffeurs.service';
import { PlanningGardeService } from 'src/app/services/planning.garde.service';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';

@Component({
    standalone: false,
    selector: 'app-add-palnning-garde',
    templateUrl: './add-palnning-garde.component.html',
    styleUrls: ['./add-palnning-garde.component.css'],
})
export class AddPalnningGardeComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject<any>(); listeChauffeurs: Array<Chauffeur> = [];

  disponibilites: any = environment.DISPONIBILITE_CHAUFFEUR;  typePermis: any; user: any;  closeResult: string = "";
  planningGarde: PlannigGarde = new PlannigGarde; type_permis: CategoriePermis = new CategoriePermis;
  form: UntypedFormGroup;

  elementChauffeurSelected: any = {id: '', text: '--'};
  dataChauffeurSelect2: any[] = [];

  optionSelect2 = {
    width: '100%',
    multiple: false,
    tags: false,
    language: 'fr'
  };
  modalTitle: string = "";
  isEdit: boolean = false;
  formSubmitted: boolean = false;
  chauffeurId: any = null;
  chauffeurList: any;
  chauffeur: any;
  spinning: boolean = false;
  planningId: any;
  planning: any;

  constructor(private ngxService: NgxUiLoaderService, private chauffeursService: ChauffeursService,
    private utilsService: UtilsService, private modalService: NgbModal, private router: Router,
    private formBuilder: UntypedFormBuilder, private planningGardeService: PlanningGardeService, private activatedRoute: ActivatedRoute) {
      this.form = formBuilder.group(
        {
          date_debut: ['',Validators.required],
          date_fin: ['',Validators.required],
          heure_debut: ['',Validators.required],
          heure_fin: ['',Validators.required],
        })
     }

  ngOnInit(): void {
    this.getChauffeurs();
    this.getParamValue();
    this.spinning = false;
  }

  reset(){
    this.planningGarde = new PlannigGarde;
    this.listeChauffeurs = [];
  }

  //Get list of chauffeurs
  getChauffeurs(): void {
    this.chauffeursService.getChauffeurs().subscribe({
      next: value => {
        this.chauffeurList = value.data;
        this.binddataChauffeurSelect2();
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

  getChauffeurById(chauffeurId: any){
    this.spinning = true;
    this.chauffeursService.getChauffeurById(chauffeurId).subscribe({
      next: value =>{
        if(value.data !== null){
          this.chauffeur = value.data;
          let isPresent = this.listeChauffeurs.some(function (el) {
            if(el.id == chauffeurId) return true; else return false;
          })
          if (!isPresent)
            this.listeChauffeurs.push(this.chauffeur);
        }
        this.spinning = false;
      },
      error: err =>{
        this.utilsService.handleError(err);
      },
      complete: () => {
      }
    });
  }

  getPlanningGardeById(planningId: any){
    this.spinning = true;
    this.planningGardeService.getPlanningGardeById(planningId).subscribe({
      next: value =>{
        if(value.data !== null){
          this.planning = value.data;
          this.listeChauffeurs = this.planning.chauffeurs;
          this.isEditingPlanning(this.planning);
        }
      },
      error: err =>{
        this.utilsService.handleError(err);
      },
      complete: () => {
      }
    });
  }

  //Remove row from chauffeur table
  removeChauffeurRow(i: number) {
    this.listeChauffeurs.splice(i, 1);
  }

  //Adding chauffeur to planning gard list
  addChauffeurToPanningGarde(chauffeurId: any = this.chauffeurId){
    this.getChauffeurById(chauffeurId);
  }

  onSubmit(): void {
    this.formSubmitted = true;
    let planninggarde: any = {
      date_debut: this.form.get('date_debut')?.value,
      date_fin: this.form.get('date_fin')?.value,
      heure_debut: this.form.get('heure_debut')?.value,
      heure_fin: this.form.get('heure_fin')?.value,
      created_by: 1,
      chauffeurs: this.listeChauffeurs,
    }

    if (this.listeChauffeurs.length == 0) {
      this.utilsService.showErreurMessage('Erreur','Veuillez ajouter les chauffeurs au planning.');
    }

    if (planninggarde.date_debut > planninggarde.date_fin) {
      this.utilsService.showErreurMessage('Erreur','Veuillez corriger les dates du planning.');
    } else{

      if (this.form.valid) {
        if(this.isEdit){
          this.savePlanningGarde(planninggarde);
        } else {
          planninggarde.id = this.planningId;
          this.editPlanningGarde(planninggarde);
        }
      } else {
        this.utilsService.showErreurMessage('Erreur','Veuillez renseigner tous les champs.');
      }
    }
  }

  editPlanningGarde(planninggarde: any) {
    this.ngxService.start();
    this.planningGardeService.savePlanningGarde(planninggarde).subscribe({
      next: value => { // success
        this.ngxService.stop();
        this.utilsService.showSuccessMessage(value.message);
        this.router.navigate(['/planning-gardes']);
      },
      error: err => { // erreur
        this.ngxService.stop();
        this.utilsService.handleError(err);
      },
      complete: () => {
        this.ngxService.stop();
      }
    });
  }

  savePlanningGarde(planninggarde: PlannigGarde) {
    this.ngxService.start();
    this.planningGardeService.savePlanningGarde(planninggarde).subscribe({
      next: value => { // success
        this.ngxService.stop();
        this.utilsService.showSuccessMessage(value.message);
        this.router.navigate(['/planning-gardes']);
      },
      error: err => { // erreur
        this.ngxService.stop();
        this.utilsService.handleError(err);
      },
      complete: () => {
        this.ngxService.stop();
      }
    });
  }


  open_lg(content:any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getParamValue(): void {
    this.planningId = this.activatedRoute.snapshot.params["planningId"];
      if ( !(this.planningId || '').length) {
        this.isAddingNewPlanningGarde();
        return;
      }
      else {
        this.modalTitle = 'Modification d\'un planning de garde';
        this.getPlanningGardeById(this.planningId);
      }
  }

  // Select2 for User
  private binddataChauffeurSelect2() {
    this.dataChauffeurSelect2 = [];
    this.dataChauffeurSelect2.push({ id: '', text: '--'});
    this.chauffeurList.forEach((chauffeur: any) => {
      this.dataChauffeurSelect2.push({ id: chauffeur.id.toString(), text: chauffeur.user.nom + ' ' + chauffeur.user.prenom});
    });
    this.setElementChauffeurSelected('', '--');
  }

  setElementChauffeurSelected(idSelect: string, textSelect: string): void {
    this.elementChauffeurSelected = {id: idSelect, text: textSelect};
    this.form.get('user_id')?.setValue(this.elementChauffeurSelected.id);
    this.chauffeurId = this.elementChauffeurSelected.id;
  }

  handleSelectChauffeurChange(valueSelected: any) {
    if (![null, undefined].includes(valueSelected)) {
      this.setElementChauffeurSelected(valueSelected, valueSelected);
    }
  }


  isAddingNewPlanningGarde() {
    this.modalTitle = 'Nouveau planning de garde';
    this.isEdit = true;
  }

  isEditingPlanning(planning: any) {
    this.form.get('date_debut')?.setValue(planning.date_debut);
    this.form.get('date_fin')?.setValue(planning.date_fin);
    this.form.get('heure_debut')?.setValue(planning.heure_debut);
    this.form.get('heure_fin')?.setValue(planning.heure_fin);
  }


}

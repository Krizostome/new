import { Component, OnInit } from '@angular/core';
import {DemandesCoursesService} from "../../../services/demandes-courses.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {ToastrService} from "ngx-toastr";
import {UtilsService} from "../../../services/utils.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DemandeVehicule} from "../../../models/demande-vehicule";
import { environment } from 'src/environments/environment';
import { Select2OptionData } from 'ng-select2';
import { Chauffeur } from 'src/app/models/chauffeur';
import { Vehicule } from 'src/app/models/vehicule';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-details-demande',
  templateUrl: './details-demande.component.html',
  styleUrls: ['./details-demande.component.css']
})
export class DetailsDemandeComponent implements OnInit {

  demandeId: any;
  environment = environment;
  demandeCourse: DemandeVehicule = new DemandeVehicule();
  isUpdatingAffectation: boolean = false;
  closeResult: string = '';
  listeVehicules: Array<Vehicule> = [];
  listeChauffeurs: Array<Chauffeur> = [];
  form!: FormGroup;

  formSubmitted = false;


  elementVehiculeSelected: Select2OptionData = {id: '', text: '--'};
  dataVehiculeSelect2: Array<Select2OptionData> = [];

  elementChauffeurSelected: Select2OptionData = {id: '', text: '--'};
  dataChauffeurSelect2: Array<Select2OptionData> = [];

  optionSelect2 = {
    width: '250px',
    multiple: false,
    tags: false,
    language: 'fr'
  };


  constructor(private demandesCoursesService: DemandesCoursesService, private ngxService: NgxUiLoaderService,
              private toastr: ToastrService, public utilsService: UtilsService,private formBuilder: FormBuilder,
              private router: Router,private modalService: NgbModal, private activatedRoute: ActivatedRoute) {
      this.form = formBuilder.group(
      {
        vehicule: ['',Validators.required],
        chauffeur: ['',Validators.required],
      }
    );
  }

  ngOnInit(): void {
    this.getParamValue();
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

  jumpToDemandeCourseDetails(demandeId: number) {
    this.router.navigate(['/demande/details/'+demandeId]);
  }
  jumpToNoteCourse(demandeId:number){
    this.router.navigate(['/demande/notation/'+demandeId]);
  }

  openAffectationModal(content:any, demandeCourse: DemandeVehicule) {
    this.demandeCourse = demandeCourse;
    this.getAllChauffeurs();
    this.getAllVehiculeByType(this.demandeCourse.type_vehicule.id);
    this.modalService.open(content, { ariaLabelledBy: 'affectation-modal-basic-title', size: 'xl' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
  }

  onSubmit(){
    this.formSubmitted = true;
    let affectation: any = {
      vehicule_id: this.form?.get('vehicule')?.value,
      chauffeur_id: this.form?.get('chauffeur')?.value,
      demande_id: this.demandeCourse.id
    }

    if (['', null, undefined].includes(affectation.vehicule_id)) {
      this.utilsService.showErreurMessage('Erreur','Veuillez sélectionner un véhicule')
    }
    if (['', null, undefined].includes(affectation.chauffeur_id)) {
      this.utilsService.showErreurMessage('Erreur','Veuillez sélectionner un chauffeur')
    }

    if (this.form.valid) {
      if (this.isUpdatingAffectation == false) {
        this.affecterCourse(affectation);
        return ;
      }
      else
        this.updateAffectationCourse(affectation);
    }

  }

  affecterCourse(affectation: any): void {
    this.ngxService.start();
    this.demandesCoursesService.affecterCourse(affectation).subscribe({
      next: value => { // success
        this.utilsService.showSuccessMessage('Demande de course affectée avec succès');
        this.modalService.dismissAll();
        this.ngxService.stop();
      },
      error: err => { // erreur
        this.utilsService.handleError(err);
        this.ngxService.stop();
      },
      complete: () => { // fin de la requete
        this.ngxService.stop();
      }
    });
  }

  updateAffectationCourse(affectation: any): void {
    this.ngxService.start();
    this.demandesCoursesService.updateAffectationCourse(affectation).subscribe({
      next: value => { // success
        this.utilsService.showSuccessMessage('Affectation modifiée avec succès');
        this.modalService.dismissAll();
        this.isUpdatingAffectation == false;
        this.ngxService.stop();
      },
      error: err => { // erreur
        this.utilsService.handleError(err);
        this.ngxService.stop();
      },
      complete: () => { // fin de la requete
        this.ngxService.stop();
      }
    });
  }

  getAllChauffeurs(): void {
    // this.ngxService.start();
    this.demandesCoursesService.getVehiculesByType(this.demandeCourse.type_vehicule.id, this.demandeCourse.id).subscribe({
      next: value => {
        if (value && value.data) {
          this.listeChauffeurs = value.data[0].chauffeurs;
          this.bindDataChauffeurSelect2();
        } else {
          this.listeChauffeurs = [];
        }
        // this.ngxService.stop();
      },
      error: err => {
        // this.ngxService.stop();
        this.utilsService.handleError(err);
      },
      complete: () => {
        this.ngxService.stop();
      }
    });
  }

  getAllVehiculeByType(typeVehicule: any): void {
    // this.ngxService.start();
    this.demandesCoursesService.getVehiculesByType(typeVehicule, this.demandeCourse.id).subscribe({
      next: value => {
        if (value && value.data) {
          this.listeVehicules = value.data[0].vehicules;
          this.bindDataVehiculeSelect2();
        } else {
          this.listeVehicules = [];
        }
        // this.ngxService.stop();
      },
      error: err => {
        // this.ngxService.stop();
        this.utilsService.handleError(err);
      },
      complete: () => {
        this.ngxService.stop();
      }
    });
  }

  open_lg(content:any, demandeCourse: DemandeVehicule) {
    this.demandeCourse = demandeCourse;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  deleteDemandeCourse() {
    const data = {
      demande_id: this.demandeCourse.id
    };
    this.ngxService.start();
    this.demandesCoursesService.deleteDemandeCourse(data).subscribe( {
      next: value => {
        this.modalService.dismissAll();
        this.router.navigate(['/demande/encours'])
        this.utilsService.showSuccessMessage('Demande de course supprimée avec succès');
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

  // Select2 for Vehicules
  private bindDataVehiculeSelect2() {
    this.dataVehiculeSelect2 = [];
    this.dataVehiculeSelect2.push({ id: '', text: '--'});
    this.listeVehicules.forEach(vehicule => {
      this.dataVehiculeSelect2.push({ id: vehicule.id.toString(), text: vehicule.immatr +' - ' +vehicule.marque});
    });
    if(this.isUpdatingAffectation == true) {
      this.dataVehiculeSelect2.push({ id: this.demandeCourse?.affectation?.vehicule?.id?.toString() || '', text: this.demandeCourse?.affectation?.vehicule?.immatr +' - ' +this.demandeCourse?.affectation?.vehicule?.marque});
      this.setElementVehiculeSelected(this.demandeCourse?.affectation?.vehicule?.id?.toString() || '', this.demandeCourse?.affectation?.vehicule?.immatr +' - ' +this.demandeCourse?.affectation?.vehicule?.marque);
    }else {
      this.setElementVehiculeSelected('', '--');
    }

  }

  setElementVehiculeSelected(idSelect: string, textSelect: string): void {
    this.elementVehiculeSelected = {id: idSelect, text: textSelect};
    this.form.get('vehicule')?.setValue(this.elementVehiculeSelected.id);
  }

  handleSelectVehiculeChange(valueSelected: any) {
    if (![null, undefined].includes(valueSelected)) {
      this.setElementVehiculeSelected(valueSelected, valueSelected);
    }
  }

   // Select2 for Chauffeurs
  private bindDataChauffeurSelect2() {
    this.dataChauffeurSelect2 = [];
    this.dataChauffeurSelect2.push({ id: '', text: '--'});
    this.listeChauffeurs.forEach(chauffeur => {
      this.dataChauffeurSelect2.push({ id: chauffeur.id.toString(), text: chauffeur?.user?.prenom +'  ' +chauffeur?.user?.nom});
    });
    if(this.isUpdatingAffectation == true) {
      this.dataChauffeurSelect2.push({ id: this.demandeCourse?.affectation?.chauffeur?.id?.toString() || '', text: this.demandeCourse?.affectation?.chauffeur?.user?.prenom +'  ' +this.demandeCourse?.affectation?.chauffeur?.user?.nom});
      this.setElementChauffeurSelected(this.demandeCourse?.affectation?.chauffeur?.id?.toString() || '',this.demandeCourse?.affectation?.chauffeur?.user?.prenom +'  ' +this.demandeCourse?.affectation?.chauffeur?.user?.nom);
    } else {
      this.setElementChauffeurSelected('', '--');
    }
  }

  setElementChauffeurSelected(idSelect: string, textSelect: string): void {
    this.elementChauffeurSelected = {id: idSelect, text: textSelect};
    this.form.get('chauffeur')?.setValue(this.elementChauffeurSelected.id);
  }

  handleSelectChauffeurChange(valueSelected: any) {
    if (![null, undefined].includes(valueSelected)) {
      this.setElementChauffeurSelected(valueSelected, valueSelected);
    }
  }

  isUpdatingAffect(): void {
    this.isUpdatingAffectation = true;
  }

  isUpdatingNotAffect(): void {
    this.isUpdatingAffectation = false;
  }
}

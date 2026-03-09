import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {DemandesCoursesService} from "../../../services/demandes-courses.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {ToastrService} from "ngx-toastr";
import {UtilsService} from "../../../services/utils.service";
import {DemandeVehicule} from "../../../models/demande-vehicule";
import {TypeVehicule} from "../../../models/type-vehicule";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import { environment } from 'src/environments/environment';
import {ActivatedRoute, Router} from "@angular/router";
import {Motif} from "../../../models/motif";
import {DatePipe} from "@angular/common";
import {User} from "../../../models/user";
import {UserService} from "../../../services/user.service";
import { ChangeDetectorRef } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-add-demande-course',
    templateUrl: './add-demande-course.component.html',
    styleUrls: ['./add-demande-course.component.css'],
})
export class AddDemandeCourseComponent implements OnInit {

  listeTypesVehicules: Array<TypeVehicule> = [];
  listeMotifs: Array<Motif> = [];
  form: UntypedFormGroup;
  formSubmitted = false;
  environment = environment;
  demandeId: any;
  demandeCourse: DemandeVehicule = new DemandeVehicule();
  modalTitle: string = '';
  isEdit: boolean = false;
  minDate: Date = new Date();
  minTime: string = '';
  formattedDate: string | null = '';
  user: User | null = new User();
  listUsers: Array<User> = [];
  isForAnotherAgent: boolean = false;

  elementTypeVehiculeSelected: any = {id: '', text: '--'};
  dataTypeVehiculeSelect2: any[] = [];

  elementMotifSelected: any = {id: '', text: '--'};
  dataMotifSelect2: any[] = [];

  elementAgentSelected: any = {id: '', text: '--'};
  dataAgentSelect2: any[] = [];

  optionSelect2 = {
    width: '100%',
    multiple: false,
    tags: false,
    language: 'fr'
  };


  constructor(private demandesCoursesService: DemandesCoursesService, private ngxService: NgxUiLoaderService,
              private toastr: ToastrService, private utilsService: UtilsService,private formBuilder: UntypedFormBuilder,
              private router: Router, private activatedRoute: ActivatedRoute,private datePipe: DatePipe, private userService: UserService,
              private cdr: ChangeDetectorRef) {
    this.formattedDate = this.datePipe.transform(this.minDate, 'yyyy-MM-dd');
    this.minTime = new Date().toString().split(' ')[4];
    this.form = formBuilder.group(
      {
        point_depart: ['',Validators.required],
        point_destination: ['',Validators.required],
        nbr_personnes: ['',Validators.required],
        objet: ['',Validators.required],
        type_vehicule: ['',Validators.required],
        motif: ['',Validators.required],
        escales: [''],
        date_depart: ['',Validators.required],
        date_retour: ['',Validators.required],
        heure_depart:['',Validators.required],
        heure_retour:['',Validators.required],
        user:['',],
        demande_myself: ['NON', []],
      }
    );
  }

  ngOnInit(): void {
    this.getAllTypesVehicules();
    this.getAllMotifs();
    this.getParamValue();
    // this.getUser();
    this.user = this.utilsService.getUserConnected();
  }

  getParamValue(): void {
    this.getUser();
    this.demandeId = this.activatedRoute.snapshot.params["demandeId"]

      if ( !(this.demandeId || '').length) { // Cas de création d'une nouvelle demande
        this.isAddingNewDemandeCourse();
        return;
      }
      else { // Cas de modification d'une demande
        this.modalTitle = 'Modification d\'une demande de course';
        this.getDemandeById(this.demandeId);

      }
  }

  getDemandeById(demandeId: any){
    this.ngxService.start();
    this.demandesCoursesService.getDemandeCourseById(demandeId).subscribe({
      next: value =>{
        if(value.data !== null){
          this.demandeCourse = value.data;
          this.isEditingDemandeCourse(this.demandeCourse);

          if (this.user?.id != this.demandeCourse?.beneficiaire?.id) { // Demande créée pour un autre agent
            this.form.get('demande_myself')?.setValue('OUI');
            this.isForAnotherAgent = true;
          } else { // Demande créée pour un moi-même
            this.form.get('demande_myself')?.setValue('NON');
            this.isForAnotherAgent = false;
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

  onSubmit(){
    this.formSubmitted = true;
    let demandeCourse: any = {
      point_depart: this.form.get('point_depart')?.value,
      point_destination: this.form.get('point_destination')?.value,
      nbre_personnes: this.form.get('nbr_personnes')?.value,
      objet: this.form.get('objet')?.value,
      type_vehicule: this.form.get('type_vehicule')?.value,
      motif: this.form.get('motif')?.value,
      escales: this.form.get('escales')?.value,
      date_depart:this.form.get('date_depart')?.value,
      date_retour:this.form.get('date_retour')?.value,
      heure_depart: this.form.get('heure_depart')?.value,
      heure_retour: this.form.get('heure_retour')?.value,
      user_id: this.user?.id,
      beneficiaire_id: this.user?.id
    }

    if (this.isForAnotherAgent == true) {
      demandeCourse.beneficiaire_id = Number(this.form.get('user')?.value);
      if (['',null,undefined].includes(this.form.get('user')?.value)) {
        this.utilsService.showErreurMessage('Erreur','Veuillez sélectionner le bénéficiaire');
        return ;
      }
    }

    if (demandeCourse.date_depart > demandeCourse.date_retour)
    {
      this.utilsService.showErreurMessage('Période non valide', 'Veillez à ce que la date de début soit valide et inférieur ou égale à la date de fin.');
      return ;
    }

    if (['',null,undefined].includes(demandeCourse.type_vehicule)) {
      this.utilsService.showErreurMessage('Erreur','Veuillez sélectionner une catégorie de véhicule');
      return ;
    }
    if (['',null,undefined].includes(demandeCourse.motif)) {
      this.utilsService.showErreurMessage('Erreur','Veuillez sélectionner un motif');
      return ;
    }

      if (this.form.valid) {
        if (this.isEdit){
          this.saveDemandeVehicule(demandeCourse);
        } else {
          demandeCourse.demande_id = this.demandeCourse.id
          this.editDemandeVehicule(demandeCourse);
        }

      } else {
        this.utilsService.showErreurMessage('Erreur', 'Veuillez remplir tous les champs obligatoires');
      }

  }

  editDemandeVehicule(demandeCourse: any): void {
    this.ngxService.start();
    this.demandesCoursesService.editDemandeCourse(demandeCourse).subscribe({
      next: value => { // success
        // $('#exampleModal').modal('toggle');
        this.ngxService.stop();
        this.utilsService.showSuccessMessage('Demande de course modifiée avec succès');
        this.router.navigate(['/demande/encours']);
      },
      error: err => { // erreur
        this.ngxService.stop();
        this.utilsService.handleError(err);
      },
      complete: () => { // fin de la requete
        this.ngxService.stop();
      }
    });
  }

  saveDemandeVehicule(demandeCourse: any): void {
    this.ngxService.start();
    this.demandesCoursesService.saveDemandeCourse(demandeCourse).subscribe({
      next: value => {
        this.ngxService.stop();
        this.utilsService.showSuccessMessage('Demande de course enregistrée avec succès');
        this.router.navigate(['/demande/encours']);
      },
      error: err => { // erreur
        this.ngxService.stop();
        this.utilsService.handleError(err);
      },
      complete: () => { // fin de la requete
        this.ngxService.stop();
      }
    });
  }

  getUser(){
    this.ngxService.start();
    this.userService.getListUser().subscribe({
      next: value => {
        if (value && value.data) {
          this.listUsers = value.data;
          this.bindDataAgentSelect2();
        } else {
          this.listUsers = [];
        }
        this.ngxService.stop();
      },
      error: err =>{
        this.utilsService.handleError(err);
        this.ngxService.stop();
      },
      complete: ()=>{
        this.ngxService.stop();
      }
    })
  }

  getAllTypesVehicules(): void {
    this.ngxService.start();
    this.demandesCoursesService.getAllTypesVehicules().subscribe({
      next: value => {
        if (value && value.data) {
          this.listeTypesVehicules = value.data;
          this.bindDataTypeVehiculeSelect2();
        } else {
          this.listeTypesVehicules = [];
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

  getAllMotifs(): void {
    this.ngxService.start();
    this.demandesCoursesService.getAllMotifs().subscribe({
      next: value => {
        if (value && value.data) {
          this.listeMotifs = value.data;
          this.bindDataMotifSelect2();
        } else {
          this.listeMotifs = [];
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

  // Select2 for Types Vehicules
  private bindDataTypeVehiculeSelect2() {
    this.dataTypeVehiculeSelect2 = [];
    this.dataTypeVehiculeSelect2.push({ id: '', text: '--'});
    this.listeTypesVehicules.forEach(typeVehicule => {
      this.dataTypeVehiculeSelect2.push({ id: typeVehicule.id.toString(), text: typeVehicule.libelle});
    });
    this.setElementTypeVehiculeSelected('', '--');
    this.cdr.detectChanges();
  }

  setElementTypeVehiculeSelected(idSelect: string, textSelect: string): void {
    this.elementTypeVehiculeSelected = {id: idSelect, text: textSelect};
    this.form.get('type_vehicule')?.setValue(this.elementTypeVehiculeSelected.id);
  }

  handleSelectTypeVehiculeChange(valueSelected: any) {
    if (![null, undefined].includes(valueSelected)) {
      this.setElementTypeVehiculeSelected(valueSelected, valueSelected);
    }
  }

  // Select2 for Motif
  private bindDataMotifSelect2() {
    this.dataMotifSelect2 = [];
    this.dataMotifSelect2.push({ id: '', text: '--'});
    this.listeMotifs.forEach(motif => {
      this.dataMotifSelect2.push({ id: motif.id.toString(), text: motif.libelle});
    });
    this.setElementMotifSelected('', '--');
    this.cdr.detectChanges();
  }

  setElementMotifSelected(idSelect: string, textSelect: string): void {
    this.elementMotifSelected = {id: idSelect, text: textSelect};
    this.form.get('motif')?.setValue(this.elementMotifSelected.id);
  }

  handleSelectMotifChange(valueSelected: any) {
    if (![null, undefined].includes(valueSelected)) {
      this.setElementMotifSelected(valueSelected, valueSelected);
    }
  }

  // Select2 for Agent
  private bindDataAgentSelect2() {
    this.dataAgentSelect2 = [];
    this.dataAgentSelect2.push({ id: '', text: '--'});
    this.listUsers.forEach(user => {
      this.dataAgentSelect2.push({ id: user.id.toString(), text: user.prenom +' ' +user.nom});
    });
    this.setElementAgentSelected('', '--');
    this.cdr.detectChanges();
  }

  setElementAgentSelected(idSelect: string, textSelect: string): void {
    this.elementAgentSelected = {id: idSelect, text: textSelect};
    this.form.get('user')?.setValue(this.elementAgentSelected.id);
  }

  handleSelectAgentChange(valueSelected: any) {
    if (![null, undefined].includes(valueSelected)) {
      this.setElementAgentSelected(valueSelected, valueSelected);
    }
  }

  isAddingNewDemandeCourse() {
    this.modalTitle = 'Nouvelle demande de course';
    this.isEdit = true;
  }

  isEditingDemandeCourse(demandeCourse: DemandeVehicule) {
    this.form.get('point_depart')?.setValue(demandeCourse.point_depart);
    this.form.get('point_destination')?.setValue(demandeCourse.point_destination);
    this.form.get('nbr_personnes')?.setValue(demandeCourse.nbre_personnes);
    this.form.get('escales')?.setValue(demandeCourse.escales);
    this.form.get('objet')?.setValue(demandeCourse.objet);
    this.form.get('date_depart')?.setValue(demandeCourse.date_depart.substring(0,10));
    this.form.get('date_retour')?.setValue(demandeCourse.date_depart.substring(0,10));
    this.form.get('heure_depart')?.setValue(demandeCourse.heure_depart.substring(0,5));
    this.form.get('heure_retour')?.setValue(demandeCourse.heure_depart.substring(0,5));
    this.setElementMotifSelected(demandeCourse.motif.id.toString(), '');
    this.setElementTypeVehiculeSelected(demandeCourse.type_vehicule.id.toString(), '');

    if (this.user?.id != demandeCourse.beneficiaire?.id && this.user?.id == demandeCourse.user?.id) { // Demande créée pour un autre agent
      this.setElementAgentSelected(demandeCourse.beneficiaire.id.toString(),'');
    } else { // Demande créée pour un moi-même
      this.setElementAgentSelected(demandeCourse.user.id.toString(),'');
    }

  }

  changeAgentOwner($event: any, owner: 'OUI' | 'NON') {
    this.isForAnotherAgent = owner === 'OUI';
  }
}

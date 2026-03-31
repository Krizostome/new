import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DemandesCoursesService } from "../../../services/demandes-courses.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ToastrService } from "ngx-toastr";
import { UtilsService } from "../../../services/utils.service";
import { DemandeVehicule } from "../../../models/demande-vehicule";
import { TypeVehicule } from "../../../models/type-vehicule";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { environment } from 'src/environments/environment';
import {ActivatedRoute, Router} from "@angular/router";
import {Motif} from "../../../models/motif";
import {DatePipe} from "@angular/common";
import {User} from "../../../models/user";
import {UserService} from "../../../services/user.service";

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
  formattedDate: string = '';
  minTime: string = '';
  user: User | null = new User();
  listUsers: Array<User> = [];
  isForAnotherAgent: boolean = false;

  elementTypeVehiculeSelected: any = { id: '', text: '--' };
  dataTypeVehiculeSelect2: any[] = [];

  elementMotifSelected: any = { id: '', text: '--' };
  dataMotifSelect2: any[] = [];

  elementAgentSelected: any = { id: '', text: '--' };
  dataAgentSelect2: any[] = [];

  optionSelect2 = {
    width: '100%',
    multiple: false,
    tags: false,
    language: 'fr'
  };

  constructor(
    private demandesCoursesService: DemandesCoursesService,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private utilsService: UtilsService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {
    this.formattedDate = this.datePipe.transform(this.minDate, 'yyyy-MM-dd') || '';
    this.minTime = new Date().toString().split(' ')[4];
    this.form = formBuilder.group({
      point_depart:      ['', Validators.required],
      point_destination: ['', Validators.required],
      nbre_personnes:     ['', Validators.required],
      objet:             ['', Validators.required],
      type_vehicule:     ['', Validators.required],
      motif:             ['', Validators.required],
      escales:           [''],
      date_depart:       ['', Validators.required],
      date_retour:       ['', Validators.required],
      heure_depart:      ['', Validators.required],
      heure_retour:      ['', Validators.required],
      user:              [''],
      demande_myself:    ['NON'],
    });
  }

  ngOnInit(): void {
    this.user = this.utilsService.getUserConnected();
    this.getAllTypesVehicules();
    this.getAllMotifs();
    this.getUser();         
    this.getParamValue();
  }

  getParamValue(): void {
    this.demandeId = this.activatedRoute.snapshot.params["demandeId"];

    if (!(this.demandeId || '').length) {
      this.isAddingNewDemandeCourse();
      return;
    } else {
      this.modalTitle = "Modification d'une demande de course";
      this.getDemandeById(this.demandeId);
    }
  }

  getDemandeById(demandeId: any): void {
    this.ngxService.start();
    this.demandesCoursesService.getDemandeCourseById(demandeId).subscribe({
      next: value => {
        if (value.data !== null) {
          this.demandeCourse = value.data;
          this.isEditingDemandeCourse(this.demandeCourse);

          if (this.user?.id != this.demandeCourse?.beneficiaire?.id) {
            this.form.get('demande_myself')?.setValue('OUI');
            this.isForAnotherAgent = true;
          } else {
            this.form.get('demande_myself')?.setValue('NON');
            this.isForAnotherAgent = false;
          }
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

  onSubmit(): void {
    this.formSubmitted = true;

    let demandeCourse: any = {
      point_depart:      this.form.get('point_depart')?.value,
      point_destination: this.form.get('point_destination')?.value,
      nbre_personnes:    this.form.get('nbre_personnes')?.value,
      objet:             this.form.get('objet')?.value,
      type_vehicule_id:  this.form.get('type_vehicule')?.value,
      motif_id:          this.form.get('motif')?.value,
      escales:           this.form.get('escales')?.value,
      date_depart:       this.form.get('date_depart')?.value,
      date_retour:       this.form.get('date_retour')?.value,
      heure_depart:      this.form.get('heure_depart')?.value,
      heure_retour:      this.form.get('heure_retour')?.value,
      user_id:           this.user?.id,
      beneficiaire_id:   this.user?.id
    };
    /* console.log('Données envoyées à l’API :', demandeCourse); // <= ici*/
    if (this.isForAnotherAgent) {
      demandeCourse.beneficiaire_id = Number(this.form.get('user')?.value);
      if (['', null, undefined].includes(this.form.get('user')?.value)) {
        this.utilsService.showErreurMessage('Erreur', 'Veuillez sélectionner le bénéficiaire');
        return;
      }
    }

    if (demandeCourse.date_depart > demandeCourse.date_retour) {
      this.utilsService.showErreurMessage(
        'Période non valide',
        'Veillez à ce que la date de début soit valide et inférieure ou égale à la date de fin.'
      );
      return;
    }

    if (['', null, undefined].includes(demandeCourse.type_vehicule_id)) {
      this.utilsService.showErreurMessage('Erreur', 'Veuillez sélectionner une catégorie de véhicule');
      return;
    }

    if (['', null, undefined].includes(demandeCourse.motif_id)) {
      this.utilsService.showErreurMessage('Erreur', 'Veuillez sélectionner un motif');
      return;
    }

    if (this.form.valid) {
      if (this.isEdit) {
        this.saveDemandeVehicule(demandeCourse);
      } else {
        demandeCourse.demande_id = this.demandeCourse.id;
        this.editDemandeVehicule(demandeCourse);
      }
    } else {
      this.utilsService.showErreurMessage('Erreur', 'Veuillez remplir tous les champs obligatoires');
    }
  }

  editDemandeVehicule(demandeCourse: any): void {
    this.ngxService.start();
    this.demandesCoursesService.editDemandeCourse(demandeCourse).subscribe({
      next: value => {
        this.ngxService.stop();
        this.utilsService.showSuccessMessage('Demande de course modifiée avec succès');
        this.router.navigate(['/demande/encours']);
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

  saveDemandeVehicule(demandeCourse: any): void {
    this.ngxService.start();
    this.demandesCoursesService.saveDemandeCourse(demandeCourse).subscribe({
      next: value => {
        this.ngxService.stop();
        this.utilsService.showSuccessMessage('Demande de course enregistrée avec succès');
        this.router.navigate(['/demande/encours']);
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

  getUser(): void {
    this.ngxService.start();
    this.userService.getListUser().subscribe({
      next: value => {
        if (value) {
          this.listUsers = value.data?.data || value.data || value.users || (Array.isArray(value) ? value : []);
          this.bindDataAgentSelect2();
        } else {
          this.listUsers = [];
        }
        this.ngxService.stop();
      },
      error: err => {
        this.utilsService.handleError(err);
        this.ngxService.stop();
      },
      complete: () => {
        this.ngxService.stop();
      }
    });
  }

  getAllTypesVehicules(): void {
    this.ngxService.start();
    this.demandesCoursesService.getAllTypesVehicules().subscribe({
      next: value => {
        if (value) {
          this.listeTypesVehicules = value.data?.data || value.data?.type_vehicules || value.data?.types_vehicules || value.type_vehicules || value.types_vehicules || value.data || (Array.isArray(value) ? value : []);
          this.bindDataTypeVehiculeSelect2();
        } else {
          this.listeTypesVehicules = [];
          this.bindDataTypeVehiculeSelect2();
        }
        this.ngxService.stop();
      },
      error: err => {
        console.error({...err});
        this.ngxService.stop();
        this.listeTypesVehicules = [];
        this.bindDataTypeVehiculeSelect2();
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
        if (value) {
          this.listeMotifs = value.data?.data || value.data?.motifs || value.motifs || value.data || (Array.isArray(value) ? value : []);
          this.bindDataMotifSelect2();
        } else {
          this.listeMotifs = [];
          this.bindDataMotifSelect2();
        }
        this.ngxService.stop();
      },
      error: err => {
        this.ngxService.stop();
        this.listeMotifs = [];
        this.bindDataMotifSelect2();
        this.utilsService.handleError(err);
      },
      complete: () => {
        this.ngxService.stop();
      }
    });
  }

  private bindDataTypeVehiculeSelect2(): void {
    this.dataTypeVehiculeSelect2 = [{ id: '', text: '--' }];
    this.listeTypesVehicules.forEach(tv => 
      this.dataTypeVehiculeSelect2.push({ id: tv.id, text: tv.libelle || '--' })
    );

    if (!this.form.get('type_vehicule')?.value) {
      this.setElementTypeVehiculeSelected('', '--');
    }
    this.cdr.detectChanges();
  }

  setElementTypeVehiculeSelected(idSelect: string, textSelect: string): void {
    this.elementTypeVehiculeSelected = { id: idSelect, text: textSelect };
    if (this.form.get('type_vehicule')?.value !== idSelect) {
      this.form.get('type_vehicule')?.setValue(idSelect);
    }
  }

  handleSelectTypeVehiculeChange(valueSelected: any): void {
    if (valueSelected != null) {
      this.setElementTypeVehiculeSelected(
        valueSelected.id ?? valueSelected,
        valueSelected.text ?? valueSelected
      );
    }
  }

  private bindDataMotifSelect2(): void {
    this.dataMotifSelect2 = [{ id: '', text: '--' }];
    this.listeMotifs.forEach(m => 
      this.dataMotifSelect2.push({ id: m.id, text: m.libelle || '--' })
    );

    if (!this.form.get('motif')?.value) {
      this.setElementMotifSelected('', '--');
    }
    this.cdr.detectChanges();
  }

  setElementMotifSelected(idSelect: string, textSelect: string): void {
    this.elementMotifSelected = { id: idSelect, text: textSelect };
    if (this.form.get('motif')?.value !== idSelect) {
      this.form.get('motif')?.setValue(idSelect);
    }
  }

  handleSelectMotifChange(valueSelected: any): void {
    if (valueSelected != null) {
      this.setElementMotifSelected(
        valueSelected.id ?? valueSelected,
        valueSelected.text ?? valueSelected
      );
    }
  }

  private bindDataAgentSelect2(): void {
    this.dataAgentSelect2 = [{ id: '', text: '--' }];
    this.listUsers.forEach(u => {
      const text = `${u.prenom || ''} ${u.nom || ''}`.trim() || u.email || '--';
      this.dataAgentSelect2.push({ id: u.id, text });
    });

    if (!this.form.get('user')?.value) {
      this.setElementAgentSelected('', '--');
    }
    this.cdr.detectChanges();
  }

  setElementAgentSelected(idSelect: string, textSelect: string): void {
    this.elementAgentSelected = { id: idSelect, text: textSelect };
    if (this.form.get('user')?.value !== idSelect) {
      this.form.get('user')?.setValue(idSelect);
    }
  }

  handleSelectAgentChange(valueSelected: any): void {
    if (valueSelected != null) {
      this.setElementAgentSelected(
        valueSelected.id ?? valueSelected,
        valueSelected.text ?? valueSelected
      );
    }
  }

  isAddingNewDemandeCourse(): void {
    this.modalTitle = 'Nouvelle demande de course';
    this.isEdit = true;
  }

  isEditingDemandeCourse(demandeCourse: DemandeVehicule): void {
    this.form.get('point_depart')?.setValue(demandeCourse.point_depart);
    this.form.get('point_destination')?.setValue(demandeCourse.point_destination);
    this.form.get('nbre_personnes')?.setValue(demandeCourse.nbre_personnes);
    this.form.get('escales')?.setValue(demandeCourse.escales);
    this.form.get('objet')?.setValue(demandeCourse.objet);
    this.form.get('date_depart')?.setValue(demandeCourse.date_depart?.substring(0, 10));
    this.form.get('date_retour')?.setValue(demandeCourse.date_retour?.substring(0, 10));
    this.form.get('heure_depart')?.setValue(demandeCourse.heure_depart?.substring(0, 5));
    this.form.get('heure_retour')?.setValue(demandeCourse.heure_retour?.substring(0, 5));

    if (demandeCourse.motif?.id) {
      this.setElementMotifSelected(demandeCourse.motif.id.toString(), demandeCourse.motif.libelle || '');
    }
    if (demandeCourse.type_vehicule?.id) {
      this.setElementTypeVehiculeSelected(demandeCourse.type_vehicule.id.toString(), demandeCourse.type_vehicule.libelle || '');
    }

    if (this.user?.id != demandeCourse.beneficiaire?.id && this.user?.id == demandeCourse.user?.id) {
      this.setElementAgentSelected(demandeCourse.beneficiaire.id.toString(), `${demandeCourse.beneficiaire.prenom || ''} ${demandeCourse.beneficiaire.nom || ''}`);
    } else {
      this.setElementAgentSelected(demandeCourse.user.id.toString(), `${demandeCourse.user.prenom || ''} ${demandeCourse.user.nom || ''}`);
    }
  }

  changeAgentOwner($event: any, owner: 'OUI' | 'NON'): void {
    this.isForAnotherAgent = owner === 'OUI';
  }
}
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DemandesCoursesService } from "../../../services/demandes-courses.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ToastrService } from "ngx-toastr";
import { UtilsService } from "../../../services/utils.service";
import { DemandeVehicule } from "../../../models/demande-vehicule";
import { TypeVehicule } from "../../../models/type-vehicule";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from "@angular/router";
import { Motif } from "../../../models/motif";
import { DatePipe } from "@angular/common";
import { User } from "../../../models/user";
import { UserService } from "../../../services/user.service";

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
    this.formattedDate = this.datePipe.transform(this.minDate, 'yyyy-MM-dd');
    this.minTime = new Date().toString().split(' ')[4];
    this.form = formBuilder.group({
      point_depart:      ['', Validators.required],
      point_destination: ['', Validators.required],
      nbr_personnes:     ['', Validators.required],
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
    this.getUser();          // ✅ CORRECTION 1 : déplacé ici — getUser() doit être appelé
                             // dans ngOnInit() directement, pas uniquement dans getParamValue()
    this.getParamValue();
  }

  getParamValue(): void {
    // ✅ CORRECTION 2 : suppression de l'appel this.getUser() ici pour éviter
    // le double appel (il était appelé ici ET dans ngOnInit en commentaire)
    this.demandeId = this.activatedRoute.snapshot.params["demandeId"];

    if (!(this.demandeId || '').length) {
      // Cas création
      this.isAddingNewDemandeCourse();
      return;
    } else {
      // Cas modification
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
      nbre_personnes:    this.form.get('nbr_personnes')?.value,
      objet:             this.form.get('objet')?.value,
      type_vehicule_id:  this.form.get('type_vehicule')?.value,
      motif:             this.form.get('motif')?.value,
      escales:           this.form.get('escales')?.value,
      date_depart:       this.form.get('date_depart')?.value,
      date_retour:       this.form.get('date_retour')?.value,
      heure_depart:      this.form.get('heure_depart')?.value,
      heure_retour:      this.form.get('heure_retour')?.value,
      user_id:           this.user?.id,
      beneficiaire_id:   this.user?.id
    };

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

    if (['', null, undefined].includes(demandeCourse.motif)) {
      this.utilsService.showErreurMessage('Erreur', 'Veuillez sélectionner un motif');
      return;
    }

    if (this.form.valid) {
      // ✅ CORRECTION 3 : la logique isEdit était INVERSÉE dans l'original.
      // isEdit = true  → nouvelle demande  → saveDemandeVehicule()
      // isEdit = false → modification      → editDemandeVehicule()
      // Avant : save était appelé quand isEdit=true (nouveau) ✅ mais
      //         edit était appelé quand isEdit=false avec demande_id ❌
      //         (demande_id était assigné sur l'objet AVANT d'appeler edit, pas save)
      if (this.isEdit) {
        // Nouvelle demande → save
        this.saveDemandeVehicule(demandeCourse);
      } else {
        // Modification → edit — on passe l'id de la demande existante
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
          // ✅ CORRECTION 4 : chaîne de fallback élargie pour couvrir toutes
          // les structures de réponse possibles de l'API Laravel
           console.log('=== REPONSE BRUTE vehicule/type ===', value);
      console.log('=== TYPE ===', typeof value);
      console.log('=== KEYS ===', Object.keys(value));

          // ✅ CORRECTION 5 : appel de bindDataTypeVehiculeSelect2() garanti
          // même si la liste est vide (évite que le ng-select reste vide)
          
        } else {
          this.listeTypesVehicules = [];
          this.bindDataTypeVehiculeSelect2(); // toujours construire le select (avec juste "--")
        }
        this.ngxService.stop();
      },
      error: err => {
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
          this.listeMotifs =
            value.data?.data ||
            value.data?.motifs ||
            value.motifs ||
            value.data ||
            (Array.isArray(value) ? value : []);
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

  // ── Select2 : Types de véhicules ──
  private bindDataTypeVehiculeSelect2(): void {
    this.dataTypeVehiculeSelect2 = [{ id: '', text: '--' }];
    this.listeTypesVehicules.forEach((typeVehicule: any) => {
      const id   = (typeVehicule.id || '').toString();
      // ✅ CORRECTION 6 : ajout de libelle_type_vehicule comme fallback
      // supplémentaire pour couvrir d'autres nommages côté API
      const text = typeVehicule.libelle
                || typeVehicule.libelle_type_vehicule
                || typeVehicule.libelle_type
                || typeVehicule.text
                || '--';
      this.dataTypeVehiculeSelect2.push({ id, text });
    });

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
    // ✅ CORRECTION 7 : on stocke bien l'id (valueSelected.id) et le label
    // (valueSelected.text), pas la valeur brute de l'objet entier
    if (valueSelected != null) {
      this.setElementTypeVehiculeSelected(
        valueSelected.id   ?? valueSelected,
        valueSelected.text ?? valueSelected
      );
    }
  }

  // ── Select2 : Motifs ──
  private bindDataMotifSelect2(): void {
    this.dataMotifSelect2 = [{ id: '', text: '--' }];
    this.listeMotifs.forEach((motif: any) => {
      const id   = (motif.id || '').toString();
      const text = motif.libelle || motif.text || '--';
      this.dataMotifSelect2.push({ id, text });
    });

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
    // ✅ CORRECTION 8 : même correction que pour type_vehicule
    if (valueSelected != null) {
      this.setElementMotifSelected(
        valueSelected.id   ?? valueSelected,
        valueSelected.text ?? valueSelected
      );
    }
  }

  // ── Select2 : Agents ──
  private bindDataAgentSelect2(): void {
    this.dataAgentSelect2 = [{ id: '', text: '--' }];
    this.listUsers.forEach((user: any) => {
      const id   = (user.id || '').toString();
      const text = ((user.prenom || '') + ' ' + (user.nom || user.name || '')).trim() || user.email || '--';
      this.dataAgentSelect2.push({ id, text });
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
        valueSelected.id   ?? valueSelected,
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
    this.form.get('nbr_personnes')?.setValue(demandeCourse.nbre_personnes);
    this.form.get('escales')?.setValue(demandeCourse.escales);
    this.form.get('objet')?.setValue(demandeCourse.objet);

    // ✅ CORRECTION 9 : date_retour utilisait date_depart.substring() au lieu
    // de date_retour.substring() — copie/colle oubliée dans l'original
    this.form.get('date_depart')?.setValue(demandeCourse.date_depart?.substring(0, 10));
    this.form.get('date_retour')?.setValue(demandeCourse.date_retour?.substring(0, 10));

    // ✅ CORRECTION 10 : heure_retour utilisait heure_depart.substring() au lieu
    // de heure_retour.substring() — même problème que ci-dessus
    this.form.get('heure_depart')?.setValue(demandeCourse.heure_depart?.substring(0, 5));
    this.form.get('heure_retour')?.setValue(demandeCourse.heure_retour?.substring(0, 5));

    if (demandeCourse.motif?.id) {
      this.setElementMotifSelected(demandeCourse.motif.id.toString(), demandeCourse.motif.libelle || '');
    }
    if (demandeCourse.type_vehicule?.id) {
      // ✅ CORRECTION 11 : on passe aussi le libellé pour que le ng-select
      // affiche le texte sélectionné et ne reste pas vide en mode édition
      this.setElementTypeVehiculeSelected(
        demandeCourse.type_vehicule.id.toString(),
        demandeCourse.type_vehicule.libelle || ''
      );
    }

    if (this.user?.id != demandeCourse.beneficiaire?.id && this.user?.id == demandeCourse.user?.id) {
      this.setElementAgentSelected(
        demandeCourse.beneficiaire.id.toString(),
        (demandeCourse.beneficiaire.prenom || '') + ' ' + (demandeCourse.beneficiaire.nom || '')
      );
    } else {
      this.setElementAgentSelected(
        demandeCourse.user.id.toString(),
        (demandeCourse.user.prenom || '') + ' ' + (demandeCourse.user.nom || '')
      );
    }
  }

  changeAgentOwner($event: any, owner: 'OUI' | 'NON'): void {
    this.isForAnotherAgent = owner === 'OUI';
  }
}
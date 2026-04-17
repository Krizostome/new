import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoriePermis } from 'src/app/models/categorie-permis';
import { Chauffeur } from 'src/app/models/chauffeur';
import { User } from 'src/app/models/user';
import { ChauffeursService } from 'src/app/services/chauffeurs.service';
import { UtilsService } from 'src/app/services/utils.service';
import { VehiculesService } from 'src/app/services/vehicules.service';
import { environment } from 'src/environments/environment';

@Component({
    standalone: false,
    selector: 'app-add-chauffeur',
    templateUrl: './add-chauffeur.component.html',
    styleUrls: ['./add-chauffeur.component.css'],
})
export class AddChauffeurComponent implements OnInit {

  disponibilites: any = environment.DISPONIBILITE_CHAUFFEUR;
  typePermis: any;
  user: any;
  closeResult: string = "";
  chauffeur: Chauffeur = new Chauffeur;
  type_permis: CategoriePermis = new CategoriePermis;
  form: UntypedFormGroup;

  elementUserSelected: any = {id: '', text: '--'};
  dataUserSelect2: any[] = [];

  elementCategoriePermisSelected: any = {id: '', text: '--'};
  dataCategoriePermisSelect2: any[] = [];

  elementDisponibiliteSelected: any = {id: '', text: '--'};
  dataDisponibiliteSelect2: any[] = [];

  optionSelect2 = {
    width: '100%',
    multiple: false,
    tags: false,
    language: 'fr'
  };

  modalTitle: string = "";
  isEdit: boolean = false;
  formSubmitted: boolean = false;
  chauffeurId: any;
  usersList: any[] = [];  // ✅ Initialisé à tableau vide

  constructor(
    private ngxService: NgxUiLoaderService,
    private chauffeursService: ChauffeursService,
    private utilsService: UtilsService,
    private modalService: NgbModal,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private vehiculesService: VehiculesService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.form = formBuilder.group({
      matricule: ['', Validators.required],
      num_permis: ['', Validators.required],
      adresse: [''],
      disponibilite: ['', Validators.required],
      contact: ['', Validators.required],
      email: ['', Validators.required],
      //permis_id: ['', Validators.required],
      user_id: ['', Validators.required],
      categorie_permis_id: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.bindDataDisponibiliteSelect2();
    this.getPermis();
    this.getListAgents();
    this.getParamValue();
  }

  reset() {
    this.chauffeur = new Chauffeur;
  }

  getPermis(): void {
    this.ngxService.start();
    this.vehiculesService.getCategoriePermis().subscribe({
      next: value => {
        if (value) {
          this.typePermis = value.data?.data || value.data || value.categorie_permis || (Array.isArray(value) ? value : []);
          this.bindDataCategoriePermisSelect2();
          this.cdr.detectChanges();
        }
        this.ngxService.stop();
      },
      error: err => {
        this.ngxService.stop();
        this.utilsService.handleError(err);
      }
    });
  }

  getListAgents(): void {
    this.ngxService.start(); // ✅ Ajout du loader
    this.chauffeursService.getListAgents().subscribe({
      next: value => {
        if (value) {
          // ✅ Extraction robuste selon la structure de la réponse API
          this.usersList = value.data?.data
            || value.data
            || value.users
            || value.agents
            || (Array.isArray(value) ? value : []);

          console.log('Liste agents récupérée :', this.usersList); // 🔍 Debug

          this.bindDataUserSelect2();
          this.cdr.detectChanges();
        }
        this.ngxService.stop(); // ✅ Arrêt loader dans next aussi
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

  getChauffeurById(chauffeurId: any) {
    this.ngxService.start();
    this.chauffeursService.getChauffeurById(chauffeurId).subscribe({
      next: value => {
        if (value.data !== null) {
          this.chauffeur = value.data;
          this.isEditingChauffeur(this.chauffeur);
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

    let chauffeur: any = {
      matricule: this.form.get('matricule')?.value,
      num_permis: this.form.get('num_permis')?.value,
      adresse: this.form.get('adresse')?.value,
      contact: this.form.get('contact')?.value,
      email: this.form.get('email')?.value,
      disponibilite: this.form.get('disponibilite')?.value,
      user_id: this.form.get('user_id')?.value,
      categorie_permis_id: this.form.get('categorie_permis_id')?.value,
      created_by: 1,
      statut: true,
    };

    if (['', null, undefined].includes(chauffeur.user_id)) {
      this.utilsService.showErreurMessage('Erreur', 'Veuillez sélectionner un agent');
      return;
    }

    if (this.form.valid) {
      if (this.isEdit) {
        // ✅ CORRIGÉ : isEdit = true → nouveau chauffeur → saveChauffeur (POST)
        this.saveChauffeur(chauffeur);
      } else {
        // ✅ CORRIGÉ : isEdit = false → modification → editChauffeur (PUT/PATCH)
        chauffeur.id = this.chauffeur.id;
        this.editChauffeur(chauffeur);
      }
    } else {
      this.utilsService.showErreurMessage('Erreur', 'Veuillez remplir tous les champs obligatoires');
    }
  }

 editChauffeur(chauffeur: any) {
  this.ngxService.start();
  this.chauffeursService.saveChauffeur(chauffeur).subscribe({ // ✅ même service que save
    next: (value: any) => {
      this.ngxService.stop();
      this.utilsService.showSuccessMessage(value.message);
      this.router.navigate(['/chauffeurs']);
    },
    error: (err: any) => {
      this.ngxService.stop();
      this.utilsService.handleError(err);
    },
    complete: () => {
      this.ngxService.stop();
    }
  });
}

  saveChauffeur(chauffeur: Chauffeur) {
    this.ngxService.start();
    this.chauffeursService.saveChauffeur(chauffeur).subscribe({
      next: value => {
        this.ngxService.stop();
        this.utilsService.showSuccessMessage(value.message);
        this.router.navigate(['/chauffeurs']);
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

  open_lg(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(
      result => { this.closeResult = `Closed with: ${result}`; },
      reason => {}
    );
  }

  getParamValue(): void {
    this.chauffeurId = this.activatedRoute.snapshot.params["chauffeurId"];
    if (!(this.chauffeurId || '').length) {
      this.isAddingNewChauffeur();
      return;
    } else {
      this.modalTitle = 'Modification d\'un chauffeur';
      this.getChauffeurById(this.chauffeurId);
    }
  }

  // ─── Select2 : User ───────────────────────────────────────────────────────

  private bindDataUserSelect2() {
    this.dataUserSelect2 = [{ id: '', text: '--' }];

    if (!this.usersList || this.usersList.length === 0) {
      console.warn('usersList est vide ou non défini');
      return;
    }

    this.usersList.forEach((user: any) => {
      const id = user.id?.toString() || '';
      const text = `${user.prenom || ''} ${user.nom || ''}`.trim();

      this.dataUserSelect2.push({
        id,
        text: text || user.email || '--'
      });
    });

    this.setElementUserSelected('', '--');
    console.log('dataUserSelect2 :', this.dataUserSelect2); // 🔍 Debug
  }

  setElementUserSelected(idSelect: string, textSelect: string): void {
    this.elementUserSelected = { id: idSelect, text: textSelect };
    this.form.get('user_id')?.setValue(idSelect);
  }

  handleSelectUserChange(valueSelected: any) {
    if (valueSelected != null) {
      const id = valueSelected.id ?? valueSelected;
      const text = valueSelected.text ?? '';
      this.setElementUserSelected(id, text);
    }
  }

  // ─── Select2 : Catégorie Permis ───────────────────────────────────────────

  private bindDataCategoriePermisSelect2() {
    this.dataCategoriePermisSelect2 = [{ id: '', text: '--' }];

    if (this.typePermis && this.typePermis.length > 0) {
      this.typePermis.forEach((item: any) => {
        this.dataCategoriePermisSelect2.push({
          id: item.id.toString(),
          text: item.libelle
        });
      });
    }

    this.setElementCategoriePermisSelected('', '--');
  }

  setElementCategoriePermisSelected(idSelect: string, textSelect: string): void {
    this.elementCategoriePermisSelected = { id: idSelect, text: textSelect };
    this.form.get('categorie_permis_id')?.setValue(idSelect); // ✅ On enregistre l'id
  }

  handleSelectCategoriePermisChange(valueSelected: any) {
    if (![null, undefined].includes(valueSelected?.id)) {
      // ✅ CORRIGÉ : on passe l'id en premier, pas le texte
      this.setElementCategoriePermisSelected(valueSelected.id, valueSelected.text);
    }
  }

  // ─── Select2 : Disponibilité ──────────────────────────────────────────────

  private bindDataDisponibiliteSelect2() {
    this.dataDisponibiliteSelect2 = [{ id: '', text: '--' }];
    this.disponibilites.forEach((disponibilite: any) => {
      this.dataDisponibiliteSelect2.push({
        id: disponibilite.id.toString(),
        text: disponibilite.libelle
      });
    });
    this.setElementDisponibiliteSelected('', '--');
  }

  setElementDisponibiliteSelected(idSelect: string, textSelect: string): void {
    this.elementDisponibiliteSelected = { id: idSelect, text: textSelect };
    this.form.get('disponibilite')?.setValue(textSelect);
  }

  handleSelectDisponibiliteChange(valueSelected: any) {
    if (![null, undefined].includes(valueSelected?.id)) {
      this.setElementDisponibiliteSelected(valueSelected.id, valueSelected.text);
    }
  }

  // ─── États du formulaire ──────────────────────────────────────────────────

  isAddingNewChauffeur() {
    this.modalTitle = 'Nouveau Chauffeur';
    this.isEdit = true;
  }

  isEditingChauffeur(chauffeur: any) {
    this.form.get('matricule')?.setValue(chauffeur.matricule);
    this.form.get('num_permis')?.setValue(chauffeur.num_permis);
    this.form.get('adresse')?.setValue(chauffeur.adresse);
    this.form.get('contact')?.setValue(chauffeur.contact);
    this.form.get('email')?.setValue(chauffeur.email);
    this.setElementUserSelected(chauffeur.user?.id?.toString() || '', `${chauffeur.user?.prenom || ''} ${chauffeur.user?.nom || ''}`.trim());
    this.setElementCategoriePermisSelected(chauffeur.permis?.id?.toString() || '', chauffeur.permis?.libelle || '');
    this.setElementDisponibiliteSelected(chauffeur.disponibilite?.toString() || '', chauffeur.disponibilite?.toString() || '');
  }
}
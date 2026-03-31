import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Entite } from 'src/app/models/entite.model';
import { EntiteService } from 'src/app/services/entite.service';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-entite',
  standalone: false,
  templateUrl: './add-entite.component.html',
  styleUrl: './add-entite.component.css',
})
export class AddEntiteComponent {
  entiteType: any = environment.ENTITE_TYPE;
  listeEntites: any;
  modalTitle: string = "";
  isEdit: boolean = false;

  entite: Entite = new Entite;

  form!: UntypedFormGroup;
  
  elementTypeSelected: any = {text: '--', value: '--'};
  dataEntiteTypeSelect2: any[] = [];

  optionSelect2 = {
      width: '100%',
      multiple: false,
      tags: false,
      language: 'fr'
  };

  entiteTypes: any = {text: '--', value: '--'};
  formSubmitted: boolean = false;
  entiteId: any;
   
  constructor(private entiteService: EntiteService, private ngxService: NgxUiLoaderService, private router: Router,
        private utilsService: UtilsService,  private formBuilder: UntypedFormBuilder,  private modalService: NgbModal) { 
          this.form = formBuilder.group(
        {
          type_value: ['',Validators.required],
          nom: ['',Validators.required],
          code: ['',Validators.required],
        })
  }
     
   
  ngOnInit(): void {
      this.ngxService.start();
      this.getParamValue();
      this.bindDataEntiteTyeSelect2()
      this.getChargement();
  }

  getChargement(): void {
    this.ngxService.stop();
  }

  getParamValue(): void { this.isAddingNewUser(); }
  
  isAddingNewUser() { this.modalTitle = 'Nouvel Entite'; this.isEdit = true; }

  private bindDataEntiteTyeSelect2() {
    this.dataEntiteTypeSelect2 = [];
    this.dataEntiteTypeSelect2.push({ text: '', value: '--'});
    this.entiteType.forEach((eType: any) => {
       this.dataEntiteTypeSelect2.push({ text: eType.id.toString(), value: eType.libelle});
    });
    this.setElementTypeSelected('--', '--'); 
  }

  setElementTypeSelected(textSelect: string, valueSelect: string): void {
    this.elementTypeSelected = {text: textSelect, value: valueSelect};
    this.form.get('type_value')?.setValue(this.elementTypeSelected.value);
  }

  handleSelectTypeChange(valueSelected: any) {
      if (![null, undefined].includes(valueSelected.value)) {
        this.setElementTypeSelected(valueSelected.text, valueSelected.value);
      }
  }


  onSubmit(): void {
    this.formSubmitted = true;
    let entite: any = {
      type: this.form.get('type_value')?.value,
      nom: this.form.get('nom')?.value,
      code: this.form.get('code')?.value,
    }
    if (this.form.valid) {
        this.saveEntite(entite);
    } else {
      this.utilsService.showErreurMessage('Erreur', 'Veuillez remplir tous les champs obligatoires');
    }
  }

  saveEntite(entite: Entite) {
      this.entite.id = this.entiteId;
      this.ngxService.start();
      this.entiteService.saveEntites(entite).subscribe({
        next: value => { // success
          this.ngxService.stop();
          this.utilsService.showSuccessMessage(value.message);
          this.router.navigate(['/entites']);
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


}

import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Entite } from 'src/app/models/entite.model';
import { EntiteService } from 'src/app/services/entite.service';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-entite',
  standalone: false,
  templateUrl: './update-entite.component.html',
  styleUrl: './update-entite.component.css',
})
export class UpdateEntiteComponent {
  form!: UntypedFormGroup;
  modalTitle: string = "";
  isEdit: boolean  = false;


  elementTypeSelected: any = {text: '--', value: '--'};
  dataEntiteTypeSelect2: any[] = [];

  optionSelect2 = {
      width: '100%',
      multiple: false,
      tags: false,
      language: 'fr'
  };


  entiteTypeVal: any = {'': '', 'direction': 'Direction', 'departement': 'Département', 'service': 'Service', 'Bureau': 'bureau'};


  entite!: Entite;
  entiteId!: number;

  entiteType: any = environment.ENTITE_TYPE;
  formSubmitted: boolean = false;
  entite_type: string = "";

  constructor(private entiteService: EntiteService, private ngxService: NgxUiLoaderService, private router: Router, private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService,  private formBuilder: UntypedFormBuilder,  private modalService: NgbModal) { 
    this.form = formBuilder.group({
      type_value: ['',Validators.required],
      nom: ['',Validators.required],
      code: ['',Validators.required],
    })
  }


  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params)=>{
      this.entiteId = params.entiteId;
    });
      this.getEntiteById(this.entiteId);
      this.getParamValue();
  }

  getChargement(): void {
    this.ngxService.stop();
  }

  getEntiteById(entiteId: any){
    this.ngxService.start();
    this.entiteService.getEntiteById(entiteId).subscribe({
      next: value =>{
        if(value.data !== null){
          this.entite = value.data;
          this.bindDataEntiteTyeSelect2(this.entite)
          this.isUpdatingEntite(this.entite);
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

  isUpdatingEntite(entite: any){
    this.form.get('nom')?.setValue(entite.nom);
    this.form.get('code')?.setValue(entite.code);
  }

  getParamValue(): void { this.isUpdateingNewUser(); }

  isUpdateingNewUser() { this.modalTitle = 'Update Entite'; this.isEdit = true; }

  private bindDataEntiteTyeSelect2(entite: Entite) {
    this.dataEntiteTypeSelect2 = [];
    this.dataEntiteTypeSelect2.push({ text:this.entiteTypeVal[this.entite.type], value: this.entite.type});
    this.entiteType.forEach((eType: any) => {
      if(eType.libelle !== this.entite.type){
        this.dataEntiteTypeSelect2.push({ text: eType.id.toString(), value: eType.libelle});
      }
    });
    this.setElementTypeSelected(this.entiteTypeVal[this.entite.type], this.entite.type); 
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


  onSubmit(){
    this.formSubmitted = true;

      const data = {
        type: this.form.get('type_value')?.value,
        nom: this.form.get('nom')?.value,
        code: this.form.get('code')?.value,
        entite_id: this.entiteId
      };
      if(this.form.valid){
        this.updateEntite(data);
      }

	}

	updateEntite(data: any){
		this.ngxService.start();
		this.entiteService.updateEntite(data.entite_id, data).subscribe({
			next: value => {
       this.utilsService.showSuccessMessage('Entite mise a jour avec succes.');
       this.router.navigate(['/entites']);
			 this.ngxService.stop();
			},
			error: err => {
       this.utilsService.handleError(err);
			 this.ngxService.stop();
			},
			complete: ()=>{
				this.ngxService.stop();
			}
		})
	}

}

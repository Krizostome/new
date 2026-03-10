import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,  Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TypeVehicule } from 'src/app/models/type-vehicule';
import { Vehicule } from 'src/app/models/vehicule';
import { UtilsService } from 'src/app/services/utils.service';
import { VehiculesService } from 'src/app/services/vehicules.service';
import { environment } from 'src/environments/environment';

@Component({
    standalone: false,
    selector: 'app-add-vehicule',
    templateUrl: './add-vehicule.component.html',
    styleUrls: ['./add-vehicule.component.css'],
})
export class AddVehiculeComponent implements OnInit {

  disponibilites: any = environment.DISPONIBILITE_VEHICULE;  types_vehicules: any; closeResult: string = ""; 
  type_vehicule: TypeVehicule = new TypeVehicule;
  vehicule: Vehicule = new Vehicule;
  form: UntypedFormGroup;

  elementTypeVehiculeSelected: any = {id: '', text: '--'};
  dataTypeVehiculeSelect2: any[] = [];
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
  vehculeId: any;

  constructor(private ngxService: NgxUiLoaderService, private vehiculesService: VehiculesService, 
    private utilsService: UtilsService, private modalService: NgbModal, private router: Router, 
    private formBuilder: UntypedFormBuilder, private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef) {
      this.form = formBuilder.group(
        {
          immatr: ['',Validators.required],
          marque: ['',Validators.required],
          date_mise_circulation: ['',Validators.required],
          disponibilite: ['',Validators.required],
          capacite: ['',Validators.required],
          type_vehicule_id: ['',Validators.required],
        })
     }

  ngOnInit(): void {
    this.getTypesVehicules();    
    this.bindDataDisponibiliteSelect2();
    this.getParamValue();
  }

  reset(){
    this.vehicule = new Vehicule;
  }

  getTypesVehicules(): void {
    this.ngxService.start();
    this.vehiculesService.getTypesVehicules().subscribe({
      next: value => {
        if (value) {
          this.types_vehicules = value.data?.data || value.data?.type_vehicules || value.data?.types_vehicules || value.type_vehicules || value.types_vehicules || value.data || (Array.isArray(value) ? value : []);
          this.bindDataTypeVehiculeSelect2();
          this.cdr.detectChanges();
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

  getVehiculeById(vehiculeId: any){
    this.ngxService.start();
    this.vehiculesService.getVehiculeById(vehiculeId).subscribe({
      next: value =>{
        if(value.data !== null){
          this.vehicule = value.data;
          this.isEditingVehicule(this.vehicule);
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

  trimImmatr(){
    this.form.get('immatr')?.setValue(this.form.get('immatr')?.value.trim().toUpperCase());
  }

  onSubmit(): void {
    this.formSubmitted = true;
    
    console.log(this.form.get('disponibilite')?.value);
    let vehicule: any = {
      immatr: this.form.get('immatr')?.value,
      marque: this.form.get('marque')?.value,
      date_mise_circulation: this.form.get('date_mise_circulation')?.value,
      disponibilite: this.form.get('disponibilite')?.value,
      capacite: this.form.get('capacite')?.value,
      type_vehicule_id: this.form.get('type_vehicule_id')?.value,
      created_by: 1,
    }
    
    if (['',null,undefined].includes(vehicule.type_vehicule_id)) {
      this.utilsService.showErreurMessage('Erreur','Veuillez sélectionner une catégorie de véhicule');
      return;
    }
    if (this.form.valid) {
      if (this.isEdit){
        this.saveVehicule(vehicule);
      } else {
        vehicule.id = this.vehicule.id;
        this.editVehicule(vehicule);
      }
    } else {
      this.utilsService.showErreurMessage('Erreur', 'Veuillez remplir tous les champs obligatoires');
    }
  }

  editVehicule(vehicule: any) {
    this.ngxService.start();
    this.vehiculesService.saveVehicule(vehicule).subscribe({
      next: value => { // success
        this.ngxService.stop();
        this.utilsService.showSuccessMessage(value.message);
        this.router.navigate(['/vehicules']);
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

  saveVehicule(vehicule: any) {
    this.ngxService.start();
    this.vehiculesService.saveVehicule(vehicule).subscribe({
      next: value => { // success
        this.ngxService.stop();
        this.utilsService.showSuccessMessage(value.message);
        this.router.navigate(['/vehicules']);
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

  saveTypeVehicule(): void {
    this.ngxService.start();
    this.vehiculesService.saveTypeVehicule(this.type_vehicule).subscribe({
      next: value => {
        this.ngOnInit();
        this.utilsService.showSuccessMessage(value.message);
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
  
  open_lg(content:any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getParamValue(): void {
    this.vehculeId = this.activatedRoute.snapshot.params["vehiculeId"]
      if ( !(this.vehculeId || '').length) {
        this.isAddingNewVehicule();
        return;
      }
      else {
        this.modalTitle = 'Modification d\'une demande de course';
        this.getVehiculeById(this.vehculeId);
      }
  }

  // Select2 for Types Vehicules
  private bindDataTypeVehiculeSelect2() {
    this.dataTypeVehiculeSelect2 = [];
    this.dataTypeVehiculeSelect2.push({ id: '', text: '--'});
    this.types_vehicules.forEach((typeVehicule: any) => {
      const id = (typeVehicule.id || '').toString();
      const text = typeVehicule.libelle || typeVehicule.text || typeVehicule.libelle_type || '--';
      this.dataTypeVehiculeSelect2.push({ id, text });
    });
    this.setElementTypeVehiculeSelected('', '--');
  }

  setElementTypeVehiculeSelected(idSelect: string, textSelect: string): void {
    this.elementTypeVehiculeSelected = {id: idSelect, text: textSelect};
    this.form.get('type_vehicule_id')?.setValue(this.elementTypeVehiculeSelected.id);
  }

  handleSelectTypeVehiculeChange(valueSelected: any) {
    if (![null, undefined].includes(valueSelected)) {
      this.setElementTypeVehiculeSelected(valueSelected, valueSelected);
    }
  }
  
  // Select2 for Disponibilité Vehicules
  private bindDataDisponibiliteSelect2() {
    this.dataTypeVehiculeSelect2 = [];
    this.dataDisponibiliteSelect2.push({ id: '', text: '--'});
    this.disponibilites.forEach((disponibilite: any) => {
      this.dataDisponibiliteSelect2.push({ id: disponibilite.id.toString(), text: disponibilite.libelle});
    });
    this.setElementDisponibiliteSelected('', '--');
  }

  setElementDisponibiliteSelected(idSelect: string, textSelect: string): void {
    this.elementDisponibiliteSelected = {id: idSelect, text: textSelect};
    this.form.get('disponibilite')?.setValue(this.elementDisponibiliteSelected.text);
  }

  handleSelectDisponibiliteChange(valueSelected: any) {
    if (![null, undefined].includes(valueSelected)) {
      this.setElementDisponibiliteSelected(valueSelected, valueSelected);
    }
  }

  
  isAddingNewVehicule() {
    this.modalTitle = 'Nouveau Vehicule';
    this.isEdit = true;
  }  
  
  isEditingVehicule(vehicule: any) {
    this.form.get('immatr')?.setValue(vehicule.immatr);
    this.form.get('marque')?.setValue(vehicule.marque);
    this.form.get('date_mise_circulation')?.setValue(vehicule.date_mise_circulation);
    this.form.get('capacite')?.setValue(vehicule.capacite);
    this.setElementTypeVehiculeSelected(vehicule.type.id.toString(), '');    
    this.setElementDisponibiliteSelected(vehicule.disponibilite.toString(), '');
  }

}

import { ChangeDetectorRef, Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from 'src/app/models/user';
import { EntiteService } from 'src/app/services/entite.service';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-user',
  standalone: false,
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'], 
})
export class AddUserComponent {

  modalTitle: string = "";
  isEdit: boolean = false;
  formSubmitted: boolean = false;

  form!: UntypedFormGroup;
  roles: any[] = [];
  
  elementRolesSelected: any = {id: '', text: '--'};
  dataRolesSelect2: any[] = [];

  optionSelect2 = {
      width: '100%',
      multiple: false,
      tags: false,
      language: 'fr'
  };

  entites: any[] = [];


  elementEniteSelected: any = {id: '', text: '--'};
  dataEntiteSelect2: any[] = [];

  constructor(
    private ngxService: NgxUiLoaderService,
    private formBuilder: UntypedFormBuilder,
    private userService: UserService, private cdr: ChangeDetectorRef, private entiteService: EntiteService, private utilsService: UtilsService, private router: Router
  ) {
    this.form = this.formBuilder.group({
      role_id: ['',Validators.required],
      entite_id: ['',Validators.required],
      email: ['', Validators.required],
      nom: ['',Validators.required],
      prenom: ['',Validators.required],
      tel: ['', Validators.required],
      password: ['',Validators.required],
    });
  }

  ngOnInit(): void {
    this.getParamValue();
    this.getFormSelect();
  }

  

 getFormSelect(): void{
    this.ngxService.start();
    this.getUserRoleList()
    this.getEntiteList();
    this.cdr.detectChanges();
    this.ngxService.stop();
 }


  getUserRoleList(): void {
    this.userService.getListRole().subscribe({
      next: value => {
        if (value) {
          this.roles = value && value.data ? value.data : [];
          this.bindDataUserRoleSelect2();
        }
      },error: err => {
      },complete: () => {
      }
    });
  }


   getEntiteList(): void {
    this.entiteService.getEntites().subscribe({
         next: value => {
          this.entites = value && value.data ? value.data : [];
           this.bindDataUserEntiteSelect2();
         }, error: err => {
         },complete: () => {
         }
       });
  }

  onSubmit(): void {
    this.formSubmitted = true;
     let user: any = {
      role_id: this.form.get('role_id')?.value,
      entite_id: this.form.get('entite_id')?.value,
      nom: this.form.get('nom')?.value,
      prenom: this.form.get('prenom')?.value,
      email: this.form.get('email')?.value,
      tel: this.form.get('tel')?.value,
      password: this.form.get('password')?.value,
    }

    if (this.form.valid) {
       this.saveUser(user);
    } else {
      this.utilsService.showErreurMessage('Erreur', 'Veuillez remplir tous les champs obligatoires');
    }
  }

  saveUser(user : User){
      this.ngxService.start();
      this.userService.saveUser(user).subscribe({
        next: value => { // success
          this.ngxService.stop();
          this.utilsService.showSuccessMessage('Utilisateur ajouter avec succès');
          this.router.navigate(['liste/utilisateur']);
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


  private bindDataUserRoleSelect2() {
    this.dataRolesSelect2 = [];
    this.dataRolesSelect2.push({ id: '', text: '--'});
    this.roles.forEach((role: any) => {
      const id = (role.id || '').toString();
      const text = role.libelle;
      this.dataRolesSelect2.push({ id, text: text.trim()});
    });
    this.setElementRolesSelected('', '--');
  }

  setElementRolesSelected(idSelect: string, textSelect: string): void {
    this.elementRolesSelected = {id: idSelect, text: textSelect};
    this.form.get('role_id')?.setValue(this.elementRolesSelected.id);
  }

  handleSelectRoleChange(valueSelected: any) {
      if (![null, undefined].includes(valueSelected.id)) {
        this.setElementRolesSelected(valueSelected.id, valueSelected.text);
      }
  }


  private bindDataUserEntiteSelect2() {
    this.dataEntiteSelect2 = [];
    this.dataEntiteSelect2.push({ id: '', text: '--'});
    this.entites.forEach((entite: any) => {
      const id = (entite.id || '').toString();
      const text = entite.code;
      this.dataEntiteSelect2.push({ id, text: text.trim()});
    });
    this.setElementEntiteSelected('', '--');
  }

   setElementEntiteSelected(idSelect: string, textSelect: string): void {
    this.elementEniteSelected = {id: idSelect, text: textSelect};
    this.form.get('entite_id')?.setValue(this.elementEniteSelected.id);
  }

  handleSelectEntiteChange(valueSelected: any) {
      if (![null, undefined].includes(valueSelected.id)) {
        this.setElementEntiteSelected(valueSelected.id, valueSelected.text);
      }
  }



  getParamValue(): void { this.isAddingNewUser(); }
  
  isAddingNewUser() { this.modalTitle = 'Nouveau Utilisateur'; this.isEdit = true; }
}
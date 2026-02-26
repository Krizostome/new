import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnDestroy,
  OnInit, QueryList,
  SimpleChanges,
  ViewChild, ViewChildren
} from '@angular/core';
import {Subject} from "rxjs";
import {French} from "../../../models/french";
import {DemandesCoursesService} from "../../../services/demandes-courses.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {ToastrService} from "ngx-toastr";
import {UtilsService} from "../../../services/utils.service";
import {DemandeVehicule} from "../../../models/demande-vehicule";
import {DatePipe} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {TypeVehicule} from "../../../models/type-vehicule";
import {Chauffeur} from "../../../models/chauffeur";
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import { environment } from 'src/environments/environment';
import {ChauffeursService} from "../../../services/chauffeurs.service";
import {Vehicule} from "../../../models/vehicule";
import {DataTableDirective} from "angular-datatables";
import {NgbdSortableHeader} from "../../../directives/ngbd-sortable-header.directive";
import {compare, SortEvent} from "../../../interfaces/sort-event";
import {User} from "../../../models/user";

@Component({
    standalone: false,
    selector: 'app-demandes-courses',
    templateUrl: './demandes-courses.component.html',
    styleUrls: ['./demandes-courses.component.css'],
})
export class DemandesCoursesComponent implements OnInit {

  listeDemandesDeCourses: Array<DemandeVehicule> = [];
  originalListeDemandesDeCourses: Array<DemandeVehicule> = [];
  closeResult: string = '';
  demandeCourseSelected: DemandeVehicule = new DemandeVehicule();
  listeVehicules: Array<Vehicule> = [];
  listeChauffeurs: Array<Chauffeur> = [];
  form: UntypedFormGroup;
  searchForm: UntypedFormGroup;
  formSubmitted = false;
  environment = environment;
  isRecherche: boolean = false;
  actualDate: Date = new Date();
  debut: string = '';
  fin: string = '';
  maxDate: Date = new Date();
  formattedDate: string | null = '';
  user: User | null = new User();

  elementVehiculeSelected: any = {id: '', text: '--'};
  dataVehiculeSelect2: any[] = [];

  elementChauffeurSelected: any = {id: '', text: '--'};
  dataChauffeurSelect2: any[] = [];

  optionSelect2 = {
    width: '250px',
    multiple: false,
    tags: false,
    language: 'fr'
  };

  // datatable declaration
  filter = new UntypedFormControl('');
  itemsPerPage: number = 0;
  totalItems: number = 0;
  page: number = 0;
  previousPage: number = 0;
  startPage: number = 0;
  endPage: number = 0;
  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(private demandesCoursesService: DemandesCoursesService, private ngxService: NgxUiLoaderService,
              private toastr: ToastrService, private utilsService: UtilsService, private datePipe: DatePipe,
              private modalService: NgbModal, private router: Router, private chauffeurService: ChauffeursService,
              private formBuilder: UntypedFormBuilder, private changeDetectorRef: ChangeDetectorRef) {
    this.formattedDate = this.datePipe.transform(this.maxDate, 'yyyy-MM-dd');
    this.form = formBuilder.group(
      {
        vehicule: ['',Validators.required],
        chauffeur: ['',Validators.required],
      }
    );
    this.searchForm = formBuilder.group( {
      debut: ['', Validators.required],
      fin: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.initDataTable();
    this.user = this.utilsService.getUserConnected();
    this.getAllDemandesDeCourses();
  }

  submitSearchForm() {
    this.isRecherche = true;
    this.formSubmitted = true;

    const search = {
      debut: this.searchForm.get('debut')?.value,
      fin: this.searchForm.get('fin')?.value,
      user_id: this.user?.id
    }
      if (search.debut > search.fin)
      {
        this.utilsService.showErreurMessage('Période non valide', 'Veillez à ce que votre date de début soit valide et inférieur ou égale à votre date de fin.');
      } else {
        if (this.searchForm.valid) {
          this.launchSearch(search);
        }
      }
    }

  launchSearch(data: any): void {
    this.ngxService.start();
    this.demandesCoursesService.searchDemandeCourse(data).subscribe({
      next: (value : any) => {
        if (value && value.data) {
          this.listeDemandesDeCourses = value.data;
          this.debut = value.debut;
          this.fin = value.fin;
          this.originalListeDemandesDeCourses = this.listeDemandesDeCourses;
          this.totalItems = this.originalListeDemandesDeCourses.length;
        }else
        {
          this.listeDemandesDeCourses = [];
          this.originalListeDemandesDeCourses = [];
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


  onSubmit(){
    this.formSubmitted = true;
    const affectation: any = {
      vehicule_id: this.form.get('vehicule')?.value,
      chauffeur_id: this.form.get('chauffeur')?.value,
      demande_id: this.demandeCourseSelected.id,
      user_id: this.user?.id,
      role: this.user?.role?.libelle
    }

    if (['', null, undefined].includes(affectation.vehicule_id)) {
      this.utilsService.showErreurMessage('Erreur','Veuillez sélectionner un véhicule')
    }
    if (['', null, undefined].includes(affectation.chauffeur_id)) {
      this.utilsService.showErreurMessage('Erreur','Veuillez sélectionner un chauffeur')
    }

    if (this.form.valid) {
      this.affecterCourse(affectation);
    }

  }

  affecterCourse(affectation: any): void {
    this.ngxService.start();
    this.demandesCoursesService.affecterCourse(affectation).subscribe({
      next: value => { // success
        this.utilsService.showSuccessMessage('Demande de course affectée avec succès');
        this.modalService.dismissAll();
        this.getAllDemandesDeCourses();
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

  getAllDemandesDeCourses(): void {
    this.ngxService.start();
    this.demandesCoursesService.getAllDemandesDeCourses(this.user?.id, this.user?.role?.libelle).subscribe({
      next: value => {
        if (value && value.data) {
          this.listeDemandesDeCourses = value.data;
          this.originalListeDemandesDeCourses = this.listeDemandesDeCourses;
          this.totalItems = this.originalListeDemandesDeCourses.length;
        } else {
          this.listeDemandesDeCourses = [];
          this.originalListeDemandesDeCourses = [];
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

  getAllChauffeurs(): void {
    // this.ngxService.start();
    this.demandesCoursesService.getVehiculesByType(this.demandeCourseSelected.type_vehicule.id, this.demandeCourseSelected.id).subscribe({
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
    this.demandesCoursesService.getVehiculesByType(typeVehicule, this.demandeCourseSelected.id).subscribe({
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
    this.demandeCourseSelected = demandeCourse;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  deleteDemandeCourse() {
    const data = {
      demande_id: this.demandeCourseSelected.id
    };
    this.ngxService.start();
    this.demandesCoursesService.deleteDemandeCourse(data).subscribe( {
      next: value => {
        this.modalService.dismissAll();
        this.ngxService.stop();
        this.utilsService.showSuccessMessage('Demande de course supprimée avec succès');
        this.getAllDemandesDeCourses();
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

  jumpToDemandeCourseEdit(demandeId: number) {
    this.router.navigate(['/demande/modifier/'+demandeId]);
  }

  jumpToDemandeCourseDetails(demandeId: number) {
    this.router.navigate(['/demande/details/'+demandeId]);
  }
  jumpToNoteCourse(demandeId:number){
    this.router.navigate(['/demande/notation/'+demandeId]);
  }

    openAffectationModal(content:any, demandeCourse: DemandeVehicule) {
      this.demandeCourseSelected = demandeCourse;
      this.getAllChauffeurs();
      this.getAllVehiculeByType(this.demandeCourseSelected.type_vehicule.id);
      this.modalService.open(content, { ariaLabelledBy: 'affectation-modal-basic-title', size: 'xl' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    }

  // Select2 for Vehicules
  private bindDataVehiculeSelect2() {
    this.dataVehiculeSelect2 = [];
    this.dataVehiculeSelect2.push({ id: '', text: '--'});
    this.listeVehicules.forEach(vehicule => {
      this.dataVehiculeSelect2.push({ id: vehicule.id.toString(), text: vehicule.immatr +' - ' +vehicule.marque});
    });
    this.setElementVehiculeSelected('', '--');
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
      this.dataChauffeurSelect2.push({ id: chauffeur.id.toString(), text: chauffeur?.user?.prenom +' - ' +chauffeur?.user?.nom});
    });
    this.setElementChauffeurSelected('', '--');
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

  searchFilter(term: any) {
    term = this.filter.value.toLowerCase();
    if ( term.trim().length !== 0 ) {
      this.listeDemandesDeCourses = this.originalListeDemandesDeCourses.filter(item =>
        JSON.stringify(item).toLowerCase().includes(term)
      );
    } else {
      this.listeDemandesDeCourses = this.originalListeDemandesDeCourses;
    }
    this.totalItems = this.listeDemandesDeCourses.length;
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      if (page === 1) {
        this.startPage = 0;
        this.endPage = this.itemsPerPage;
      } else {
        this.startPage = ((this.page - 1) * this.itemsPerPage);
        this.endPage = this.startPage + this.itemsPerPage;
      }

    }
  }

  initDataTable() {
    this.startPage = 0;
    this.itemsPerPage = environment.paginationNbItemsPerPage;
    this.endPage = this.startPage + this.itemsPerPage;
    this.page = 1;
  }

  onChangeDataPerPage(newValue: any) {
    this.startPage = 0;
    this.itemsPerPage = newValue;
    this.endPage = this.startPage + this.itemsPerPage;
    this.page = 1;
  }

  onSort({column, direction}: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    if (direction === '') {
      this.listeDemandesDeCourses = this.originalListeDemandesDeCourses;
    } else {
      this.listeDemandesDeCourses = [...this.originalListeDemandesDeCourses].sort((a: any, b: any) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  demarrerCourse(idDemandeCourse:any){
    this.ngxService.start();
    this.demandesCoursesService.demarrerCourse(idDemandeCourse).subscribe({
      next: value => {

        this.ngxService.stop();
        this.utilsService.showSuccessMessage('La course a été demarrée avec succès');
        this.getAllDemandesDeCourses();

      },
      error: err => {
        this.ngxService.stop();
        this.utilsService.handleError(err);
      },
      complete: () => {
        this.ngxService.stop();
      }
    })
  }

  arreterCourse(idDemandeCourse:any){
    this.ngxService.start();
    this.demandesCoursesService.arreterCourse(idDemandeCourse).subscribe({
      next: value => {

        this.ngxService.stop();
        this.utilsService.showSuccessMessage('La course a été arretée avec succès');
        this.getAllDemandesDeCourses();

      },
      error: err => {
        this.ngxService.stop();
        this.utilsService.handleError(err);
      },
      complete: () => {
        this.ngxService.stop();
      }
    })
  }

}

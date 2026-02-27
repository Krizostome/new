import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { ChauffeursService } from 'src/app/services/chauffeurs.service';
import { UntypedFormBuilder, UntypedFormControl, FormGroup, Validators } from "@angular/forms";
import { HistoriquesService } from 'src/app/services/historiques.service';
import { UtilsService } from 'src/app/services/utils.service';
import { VehiculesService } from 'src/app/services/vehicules.service';
import { NgbdSortableHeader } from 'src/app/directives/ngbd-sortable-header.directive';
import { environment } from 'src/environments/environment';
import { compare, SortEvent } from 'src/app/interfaces/sort-event';

@Component({
    standalone: false,
    selector: 'app-historique-demandes',
    templateUrl: './historique-demandes.component.html',
    styleUrls: ['./historique-demandes.component.css'],
})
export class HistoriqueDemandesComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject<any>();
  chauffeurList: any; vehiculeList: any; directionList: any;

  elementChauffeurSelected: any = { id: '', text: '--' };
  dataChauffeurSelect2: any[] = [];

  elementVehiculeSelected: any = { id: '', text: '--' };
  dataVehiculeSelect2: any[] = [];

  elementDirectionSelected: any = { id: '', text: '--' };
  dataDirectionSelect2: any[] = [];

  optionSelect2 = {
    width: '100%',
    multiple: false,
    tags: false,
    language: 'fr'
  };
  form: any;
  chauffeurId: any = ""; vehiculeId: any = ""; directionId: any = "";
  formSubmitted: boolean = false;
  historiquesDemandes: any;
  demandesEncours: number = 0; demandesNouvelles: number = 0; demandesTerminees: number = 0;


  // datatable declaration
  filter = new UntypedFormControl('');
  itemsPerPage: number = 5;
  totalItems: number = 0;
  page: number = 0;
  previousPage: number = 0;
  startPage: number = 0;
  endPage: number = 0;
  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  originalHistoriquesDemandes: any;

  constructor(private historiquesService: HistoriquesService, private chauffeursService: ChauffeursService, private ngxService: NgxUiLoaderService,
    private utilsService: UtilsService, private router: Router, private formBuilder: UntypedFormBuilder, private vehiculesService: VehiculesService,) {
    this.form = formBuilder.group(
      {
        date_debut: ['', Validators.required],
        date_fin: ['', Validators.required],
        chauffeur_id: ['',],
        vehicule_id: ['',],
        point_destination: ['',],
        direction_id: ['',],
      })
  }



  ngOnInit(): void {
    this.getChauffeurs();
    this.getVehicules();
    this.getDirections();
    this.form.get('date_debut')?.setValue((new Date()).toISOString().substring(0, 10));
    this.form.get('date_fin')?.setValue((new Date()).toISOString().substring(0, 10));
    this.getHistoriquesDemandes();
  }

  refresh() {
    this.form.get('date_debut')?.setValue((new Date()).toISOString().substring(0, 10));
    this.form.get('date_fin')?.setValue((new Date()).toISOString().substring(0, 10));
    this.setElementChauffeurSelected('', '--');
    this.setElementVehiculeSelected('', '--');
    this.form.get('point_destination')?.setValue('');
    this.getHistoriquesDemandes();
  }

  onSubmit() {
    this.formSubmitted = true;
    this.getHistoriquesDemandes();
  }


  //Exporter les Hist Demande Courses to xls
  exportHistoriqueDemandesCourses(): void {
    this.formSubmitted = true;
    setTimeout(() => this.ngxService.start());
    let body: any = {
      date_debut: this.form.get('date_debut')?.value,
      date_fin: this.form.get('date_fin')?.value,
      point_destination: this.form.get('point_destination')?.value,
      vehiculeID: this.vehiculeId,
      chauffeurID: this.chauffeurId,
      directionID: this.directionId,
    }

    this.historiquesService.exportHistoriquesDemandes(body).subscribe((response: any) => {
        setTimeout(() => this.ngxService.stop());
        let blob = new Blob([response], { type: 'application/xls' });
        let downloadURL = window.URL.createObjectURL(response);
        let link = document.createElement('a');
        link.href = downloadURL;
        link.download = "HistoriqueDemandes_" + this.form.get('date_fin')?.value + ".xls";
        link.click();
      },
      error => {
        setTimeout(() => this.ngxService.start());
        this.utilsService.handleError("Impossible de joindre le serveur, contacter l'administrateur");
      });
    }


  //Get Historique des demandes
  getHistoriquesDemandes(): void {
    setTimeout(() => this.ngxService.start());
    let body: any = {
      date_debut: this.form.get('date_debut')?.value,
      date_fin: this.form.get('date_fin')?.value,
      point_destination: this.form.get('point_destination')?.value,
      vehiculeID: this.vehiculeId,
      chauffeurID: this.chauffeurId,
      directionID: this.directionId,
    }

    this.historiquesService.getHistoriquesDemandes(body).subscribe({
      next: value => {
        if (value && value.data) {
          this.historiquesDemandes = value.data;

          this.originalHistoriquesDemandes = this.historiquesDemandes;
          this.totalItems = this.originalHistoriquesDemandes.length;

          this.demandesEncours = value.demandesEncours;
          this.demandesNouvelles = value.demandesNouvelles;
          this.demandesTerminees = value.demandesTerminees;

        } else {
          this.historiquesDemandes = [];
          this.originalHistoriquesDemandes = [];
        }
        setTimeout(() => this.ngxService.stop());
      },
      error: err => {
        setTimeout(() => this.ngxService.stop());
        this.utilsService.handleError(err);
      },
      complete: () => {
        setTimeout(() => this.ngxService.stop());
      }
    });
  }

  //Jump to Detail demande de courses
  jumpToDemandeCourseDetails(demandeId: number) {
    this.router.navigate(['/demande/details/' + demandeId]);
  }

  //Get list of chauffeurs
  getChauffeurs(): void {
    setTimeout(() => this.ngxService.start());
    this.chauffeursService.getChauffeurs().subscribe({
      next: value => {
        this.chauffeurList = value.data;
        this.binddataChauffeurSelect2();
      },
      error: err => {
        setTimeout(() => this.ngxService.stop());
        this.utilsService.handleError(err);
      },
      complete: () => {
        setTimeout(() => this.ngxService.stop());
      }
    });
  }

  // Select2 for Chauffeur
  private binddataChauffeurSelect2() {
    this.dataChauffeurSelect2 = [];
    this.dataChauffeurSelect2.push({ id: '', text: '--' });
    this.chauffeurList.forEach((chauffeur: any) => {
      this.dataChauffeurSelect2.push({ id: chauffeur.id.toString(), text: chauffeur.user.nom + ' ' + chauffeur.user.prenom });
    });
    this.setElementChauffeurSelected('', '--');
  }

  setElementChauffeurSelected(idSelect: string, textSelect: string): void {
    this.elementChauffeurSelected = { id: idSelect, text: textSelect };
    this.form.get('chauffeur_id')?.setValue(this.elementChauffeurSelected.id);
    this.chauffeurId = this.elementChauffeurSelected.id;
  }

  handleSelectChauffeurChange(valueSelected: any) {
    if (![null, undefined].includes(valueSelected)) {
      this.setElementChauffeurSelected(valueSelected, valueSelected);
    }
  }

  //Get list of Véhicule
  getVehicules(): void {
    setTimeout(() => this.ngxService.start());
    this.vehiculesService.getListVehicules().subscribe({
      next: value => {
        this.vehiculeList = value.data;
        this.binddataVehiculeSelect2();
      },
      error: err => {
        setTimeout(() => this.ngxService.stop());
        this.utilsService.handleError(err);
      },
      complete: () => {
        setTimeout(() => this.ngxService.stop());
      }
    });
  }

  // Select2 for Véhicule
  private binddataVehiculeSelect2() {
    this.dataVehiculeSelect2 = [];
    this.dataVehiculeSelect2.push({ id: '', text: '--' });
    this.vehiculeList.forEach((vehicule: any) => {
      this.dataVehiculeSelect2.push({ id: vehicule.id.toString(), text: vehicule.immatr });
    });
    this.setElementVehiculeSelected('', '--');
  }

  setElementVehiculeSelected(idSelect: string, textSelect: string): void {
    this.elementVehiculeSelected = { id: idSelect, text: textSelect };
    this.form.get('vehicule_id')?.setValue(this.elementVehiculeSelected.id);
    this.vehiculeId = this.elementVehiculeSelected.id;
  }

  handleSelectVehiculeChange(valueSelected: any) {
    if (![null, undefined].includes(valueSelected)) {
      this.setElementVehiculeSelected(valueSelected, valueSelected);
    }
  }

  //Get list of Directions
  getDirections(): void {
    setTimeout(() => this.ngxService.start());
    this.historiquesService.getDirections().subscribe({
      next: value => {
        this.directionList = value.data;
        this.binddataDirectionSelect2();
      },
      error: err => {
        setTimeout(() => this.ngxService.stop());
        this.utilsService.handleError(err);
      },
      complete: () => {
        setTimeout(() => this.ngxService.stop());
      }
    });
  }

  // Select2 for Véhicule
  private binddataDirectionSelect2() {
    this.dataDirectionSelect2 = [];
    this.dataDirectionSelect2.push({ id: '', text: '--' });
    this.directionList.forEach((direction: any) => {
      this.dataDirectionSelect2.push({ id: direction.id.toString(), text: direction.libelle + ' (' + direction.code + ')' });
    });
    this.setElementDirectionSelected('', '--');
  }

  setElementDirectionSelected(idSelect: string, textSelect: string): void {
    this.elementDirectionSelected = { id: idSelect, text: textSelect };
    this.form.get('direction_id')?.setValue(this.elementDirectionSelected.id);
    this.directionId = this.elementDirectionSelected.id;
  }

  handleSelectDirectionChange(valueSelected: any) {
    if (![null, undefined].includes(valueSelected)) {
      this.setElementDirectionSelected(valueSelected, valueSelected);
    }
  }

  //Data Table
  searchFilter(term: any) {
    term = this.filter.value.toLowerCase();
    if (term.trim().length !== 0) {
      this.historiquesDemandes = this.originalHistoriquesDemandes.filter((item: any) =>
        JSON.stringify(item).toLowerCase().includes(term)
      );
    } else {
      this.historiquesDemandes = this.originalHistoriquesDemandes;
    }
    this.totalItems = this.historiquesDemandes.length;
  }

  onSort({ column, direction }: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    if (direction === '') {
      this.historiquesDemandes = this.originalHistoriquesDemandes;
    } else {
      this.historiquesDemandes = [...this.originalHistoriquesDemandes].sort((a: any, b: any) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
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

}

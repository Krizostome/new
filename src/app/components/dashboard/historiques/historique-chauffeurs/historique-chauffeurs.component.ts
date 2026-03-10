import { Component, OnInit, QueryList, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { NgbdSortableHeader } from 'src/app/directives/ngbd-sortable-header.directive';
import { compare, SortEvent } from 'src/app/interfaces/sort-event';
import { ChauffeursService } from 'src/app/services/chauffeurs.service';
import { HistoriquesService } from 'src/app/services/historiques.service';
import { NoteService } from 'src/app/services/note.service';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';

@Component({
    standalone: false,
    selector: 'app-historique-chauffeurs',
    templateUrl: './historique-chauffeurs.component.html',
    styleUrls: ['./historique-chauffeurs.component.css'],
})
export class HistoriqueChauffeursComponent implements OnInit {
  chauffeurId: any = "";
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject<any>();
  chauffeurList: any; form: any; formSubmitted: boolean = false; historiquesChauffeurs: any;

  elementChauffeurSelected: any = { id: '', text: '--' };
  dataChauffeurSelect2: any[] = [];

  optionSelect2 = {
    width: '100%',
    multiple: false,
    tags: false,
    language: 'fr'
  };
  
  // datatable declaration
  filter = new UntypedFormControl('');
  itemsPerPage: number = 5;
  totalItems: number = 0;
  page: number = 0;
  previousPage: number = 0;
  startPage: number = 0;
  endPage: number = 0;
  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  originalHistoriquesChauffeurs: any;

  constructor(private historiquesService: HistoriquesService, private chauffeursService: ChauffeursService, private ngxService: NgxUiLoaderService,
    private utilsService: UtilsService, private formBuilder: UntypedFormBuilder, private noteService: NoteService,
    private cdr: ChangeDetectorRef) {
    this.form = formBuilder.group(
      {
        date_debut: ['',],
        date_fin: ['',],
        chauffeur_id: ['',],
      })
  }

  ngOnInit(): void {
    this.getChauffeurs();
    this.onSubmit();
    this.form.get('date_debut')?.setValue((new Date()).toISOString().substring(0,10));
    this.form.get('date_fin')?.setValue((new Date()).toISOString().substring(0,10));
  }

  onSubmit() {
    this.formSubmitted = true;
    this.getHistoriquesPerformancesChauffeurs();
  }

  //Exporter les Performances chauffeur to xls
  exportPerformancesChauffeur(): void {
    this.formSubmitted = true;
    this.ngxService.start();
    let body: any = {
      date_debut: this.form.get('date_debut')?.value,
      date_fin: this.form.get('date_fin')?.value,
      chauffeur_id: this.form.get('chauffeur_id')?.value,
    }
    
    this.historiquesService.exportPerformancesChauffeur(body).subscribe((response: any) => {
        this.ngxService.stop();
        let blob = new Blob([response], { type: 'application/xls' });
        let downloadURL = window.URL.createObjectURL(response);
        let link = document.createElement('a');
        link.href = downloadURL;
        link.download = "PerformancesChauffeur_" + this.form.get('chauffeur_id')?.value + ".xls";
        link.click();
      },
      error => {
        this.ngxService.start();
        this.utilsService.handleError("Impossible de générer le document excel. Veuillez reprendre.");
      });
    }
  
  refresh() {
    this.form.get('date_debut')?.setValue((new Date()).toISOString().substring(0, 10));
    this.form.get('date_fin')?.setValue((new Date()).toISOString().substring(0, 10));
    this.setElementChauffeurSelected('', '--');
    this.setElementChauffeurSelected('', '--');
    this.getHistoriquesPerformancesChauffeurs();
  }

  //Get Historique des performances chauffeurs
  getHistoriquesPerformancesChauffeurs(): void {
    this.ngxService.start();
    let body: any = {
      date_debut: this.form.get('date_debut')?.value,
      date_fin: this.form.get('date_fin')?.value,
      chauffeur_id: this.form.get('chauffeur_id')?.value,
    }
    this.historiquesService.getHistoriquesPerformancesChauffeurs(body).subscribe({
      next: value => {

        if (value) {
          this.historiquesChauffeurs = value.data?.data || value.data || (Array.isArray(value) ? value : []);
          this.originalHistoriquesChauffeurs = this.historiquesChauffeurs;
          this.totalItems = this.originalHistoriquesChauffeurs.length;
          this.cdr.detectChanges();
          
        } else {
          this.historiquesChauffeurs = [];
          this.originalHistoriquesChauffeurs = [];
        }
        this.ngxService.stop();
      },
      error: err => {
        this.ngxService.stop();
        this.utilsService.showErreurMessage('Erreur', err);
        this.utilsService.handleError(err);
      },
      complete: () => {
        this.ngxService.stop();
      }
    });
  }

  //Get list of chauffeurs
  getChauffeurs(): void {
    this.chauffeursService.getChauffeurs().subscribe({
      next: value => {
        if (value) {
          this.chauffeurList = value.data?.data || value.data || value.chauffeurs || (Array.isArray(value) ? value : []);
          this.binddataChauffeurSelect2();
        }
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
  
  // Select2 for Chauffeur
  private binddataChauffeurSelect2() {
    this.dataChauffeurSelect2 = [];
    this.dataChauffeurSelect2.push({ id: '', text: '--' });
    this.chauffeurList.forEach((chauffeur: any) => {
      const id = (chauffeur.id || '').toString();
      const text = (chauffeur?.user?.nom || '') + ' ' + (chauffeur?.user?.prenom || '');
      this.dataChauffeurSelect2.push({ id, text: text.trim() || '--' });
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

  //Data Table
  searchFilter(term: any) {
    term = this.filter.value.toLowerCase();
    if ( term.trim().length !== 0 ) {
      this.historiquesChauffeurs = this.originalHistoriquesChauffeurs.filter((item: any) =>
        JSON.stringify(item).toLowerCase().includes(term)
      );
    } else {
      this.historiquesChauffeurs = this.originalHistoriquesChauffeurs;
    }
    this.totalItems = this.historiquesChauffeurs.length;
  }
  
  onSort({column, direction}: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    if (direction === '') {
      this.historiquesChauffeurs = this.originalHistoriquesChauffeurs;
    } else {
      this.historiquesChauffeurs = [...this.originalHistoriquesChauffeurs].sort((a: any, b: any) => {
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

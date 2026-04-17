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
  chauffeurId: any = '';
  chauffeurList: any;
  form: any;
  formSubmitted: boolean = false;
  historiquesChauffeurs: any[] = [];
  originalHistoriquesChauffeurs: any[] = [];

  elementChauffeurSelected: any = { id: '', text: '--' };
  dataChauffeurSelect2: any[] = [];

  // Pagination
  filter = new UntypedFormControl('');
  itemsPerPage: number = 5;
  totalItems: number = 0;
  page: number = 1;
  previousPage: number = 0;
  startPage: number = 0;
  endPage: number = 5;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(
    private historiquesService: HistoriquesService,
    private chauffeursService: ChauffeursService,
    private ngxService: NgxUiLoaderService,
    private utilsService: UtilsService,
    private formBuilder: UntypedFormBuilder,
    private noteService: NoteService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = formBuilder.group({
      date_debut: [''],
      date_fin: [''],
      chauffeur_id: [''],
    });
  }

  ngOnInit(): void {
    // ✅ FIX: Initialiser les dates AVANT de lancer la recherche
    this.form.get('date_debut')?.setValue(new Date().toISOString().substring(0, 10));
    this.form.get('date_fin')?.setValue(new Date().toISOString().substring(0, 10));
    this.initDataTable(); // ✅ FIX: était jamais appelé
    this.getChauffeurs();
    this.getHistoriquesPerformancesChauffeurs();
  }

  onSubmit() {
    this.formSubmitted = true;
    this.getHistoriquesPerformancesChauffeurs();
  }

  exportPerformancesChauffeur(): void {
    this.formSubmitted = true;
    this.ngxService.start();
    const body: any = {
      date_debut: this.form.get('date_debut')?.value,
      date_fin: this.form.get('date_fin')?.value,
      chauffeur_id: this.form.get('chauffeur_id')?.value,
    };

    this.historiquesService.exportPerformancesChauffeur(body).subscribe({
      next: (response: any) => {
        this.ngxService.stop();
        const blob = new Blob([response], { type: 'application/vnd.ms-excel' });
        const downloadURL = window.URL.createObjectURL(blob); // ✅ FIX: utilisé blob pas response
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = `PerformancesChauffeur_${this.form.get('chauffeur_id')?.value}.xls`;
        link.click();
        window.URL.revokeObjectURL(downloadURL); // ✅ FIX: libérer la mémoire
      },
      error: (error) => {
        this.ngxService.stop();
        this.utilsService.handleError('Impossible de générer le document Excel. Veuillez réessayer.');
      },
    });
  }

  refresh() {
    this.form.get('date_debut')?.setValue(new Date().toISOString().substring(0, 10));
    this.form.get('date_fin')?.setValue(new Date().toISOString().substring(0, 10));
    this.setElementChauffeurSelected('', '--'); // ✅ FIX: doublons supprimés
    this.filter.setValue('');                   // ✅ FIX: réinitialiser le filtre aussi
    this.getHistoriquesPerformancesChauffeurs();
  }

  getHistoriquesPerformancesChauffeurs(): void {
    this.ngxService.start();
    const body: any = {
      date_debut: this.form.get('date_debut')?.value,
      date_fin: this.form.get('date_fin')?.value,
      chauffeur_id: this.form.get('chauffeur_id')?.value,
    };

    this.historiquesService.getHistoriquesPerformancesChauffeurs(body).subscribe({
      next: (value) => {
        if (value) {
          this.historiquesChauffeurs =
            value.data?.data || value.data || (Array.isArray(value) ? value : []);
          this.originalHistoriquesChauffeurs = [...this.historiquesChauffeurs]; // ✅ FIX: copie indépendante
          this.totalItems = this.originalHistoriquesChauffeurs.length;
          this.initDataTable(); // ✅ FIX: réinitialiser la pagination après chaque chargement
          this.cdr.detectChanges();
        } else {
          this.historiquesChauffeurs = [];
          this.originalHistoriquesChauffeurs = [];
          this.totalItems = 0;
        }
        this.ngxService.stop();
      },
      error: (err) => {
        this.ngxService.stop();
        this.utilsService.showErreurMessage('Erreur', err);
        this.utilsService.handleError(err);
      },
    });
  }

  getChauffeurs(): void {
    this.chauffeursService.getChauffeurs().subscribe({
      next: (value) => {
        if (value) {
          this.chauffeurList =
            value.data?.data || value.data || value.chauffeurs || (Array.isArray(value) ? value : []);
          this.binddataChauffeurSelect2();
        }
      },
      error: (err) => {
        this.ngxService.stop();
        this.utilsService.handleError(err);
      },
    });
  }

  private binddataChauffeurSelect2() {
    this.dataChauffeurSelect2 = [{ id: '', text: '--' }];
    this.chauffeurList.forEach((chauffeur: any) => {
      const id = (chauffeur.id || '').toString();
      const text = `${chauffeur?.user?.nom || ''} ${chauffeur?.user?.prenom || ''}`.trim() || '--';
      this.dataChauffeurSelect2.push({ id, text });
    });
    this.setElementChauffeurSelected('', '--');
  }

  setElementChauffeurSelected(idSelect: string, textSelect: string): void {
    this.elementChauffeurSelected = { id: idSelect, text: textSelect };
    this.form.get('chauffeur_id')?.setValue(idSelect);
    this.chauffeurId = idSelect;
  }

  // ✅ FIX CRITIQUE: était valueSelected au lieu de valueSelected.id / valueSelected.text
  handleSelectChauffeurChange(valueSelected: any) {
    if (valueSelected !== null && valueSelected !== undefined) {
      this.setElementChauffeurSelected(
        valueSelected?.id ?? '',
        valueSelected?.text ?? '--'
      );
    } else {
      this.setElementChauffeurSelected('', '--');
    }
  }

  // ✅ FIX: searchFilter reçoit la valeur directement, pas un objet
  searchFilter(term: string) {
    const searchTerm = (term || this.filter.value || '').toLowerCase().trim();
    if (searchTerm.length !== 0) {
      this.historiquesChauffeurs = this.originalHistoriquesChauffeurs.filter((item: any) =>
        JSON.stringify(item).toLowerCase().includes(searchTerm)
      );
    } else {
      this.historiquesChauffeurs = [...this.originalHistoriquesChauffeurs];
    }
    this.totalItems = this.historiquesChauffeurs.length;
    this.initDataTable();
  }

  onSort({ column, direction }: SortEvent) {
    this.headers.forEach((header) => {
      if (header.sortable !== column) header.direction = '';
    });

    if (direction === '') {
      this.historiquesChauffeurs = [...this.originalHistoriquesChauffeurs];
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
      this.startPage = (page - 1) * this.itemsPerPage; // ✅ FIX: logique simplifiée et correcte
      this.endPage = this.startPage + this.itemsPerPage;
    }
  }

  initDataTable() {
    this.startPage = 0;
    this.itemsPerPage = environment.paginationNbItemsPerPage || 5;
    this.endPage = this.itemsPerPage;
    this.page = 1;
    this.previousPage = 0;
  }

  onChangeDataPerPage(newValue: any) {
    this.itemsPerPage = newValue;
    this.startPage = 0;
    this.endPage = this.itemsPerPage;
    this.page = 1;
  }
}
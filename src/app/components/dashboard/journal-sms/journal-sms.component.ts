import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {UtilsService} from "../../../services/utils.service";
import {DemandeVehicule} from "../../../models/demande-vehicule";
import {Vehicule} from "../../../models/vehicule";
import {Chauffeur} from "../../../models/chauffeur";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../models/user";
import { environment } from 'src/environments/environment';
import {DemandesCoursesService} from "../../../services/demandes-courses.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {ToastrService} from "ngx-toastr";
import {DatePipe} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";
import {ChauffeursService} from "../../../services/chauffeurs.service";
import {compare, SortEvent} from "../../../interfaces/sort-event";
import {NgbdSortableHeader} from "../../../directives/ngbd-sortable-header.directive";
import {JournalSms} from "../../../models/journal-sms";
import {JournalSmsService} from "../../../services/journal-sms.service";

@Component({
  selector: 'app-journal-sms',
  templateUrl: './journal-sms.component.html',
  styleUrls: ['./journal-sms.component.css']
})
export class JournalSmsComponent implements OnInit {

  listeSms: Array<JournalSms> = [];
  originalListeSms: Array<JournalSms> = [];
  closeResult: string = '';
  smsSelected: JournalSms = new JournalSms();
  searchForm: FormGroup;
  formSubmitted = false;
  environment = environment;
  isRecherche: boolean = false;
  actualDate: Date = new Date();
  debut: string = '';
  fin: string = '';
  maxDate: Date = new Date();
  firstDayOfCurrentMonth = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), 1);
  formattedDate: string | null = '';
  formattedFirstDayOfCurrentMonth: string | null = '';
  user: User | null = new User();

  // datatable declaration
  filter = new FormControl('');
  itemsPerPage: number = 0;
  totalItems: number = 0;
  page: number = 0;
  previousPage: number = 0;
  startPage: number = 0;
  endPage: number = 0;
  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(private demandesCoursesService: DemandesCoursesService, private ngxService: NgxUiLoaderService,
              private toastr: ToastrService, public utilsService: UtilsService, private datePipe: DatePipe,
              private modalService: NgbModal, private router: Router, private chauffeurService: ChauffeursService,
              private formBuilder: FormBuilder, private smsService: JournalSmsService) {
    this.formattedDate = this.datePipe.transform(this.maxDate, 'yyyy-MM-dd');
    this.searchForm = formBuilder.group( {
      debut: ['', Validators.required],
      fin: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.initDataTable();
    this.user = this.utilsService.getUserConnected();
    this.setToDefaultDate();
    this.getAllSMS();
  }

  getAllSMS(): void {
    this.ngxService.start();
    this.smsService.getAllSMS().subscribe({
      next: value => {
        if (value && value.data) {
          this.listeSms = value.data;
          this.originalListeSms = this.listeSms;
          this.totalItems = this.originalListeSms.length;
        } else {
          this.listeSms = [];
          this.originalListeSms = [];
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
    this.smsService.searchSMS(data).subscribe({
      next: (value : any) => {
        if (value && value.data) {
          this.listeSms = value.data;
          this.debut = value.debut;
          this.fin = value.fin;
          this.originalListeSms = this.listeSms;
          this.totalItems = this.originalListeSms.length;
        }else
        {
          this.listeSms = [];
          this.originalListeSms = [];
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

  open_lg(content:any, mySms: JournalSms) {
    this.smsSelected = mySms;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  searchFilter(term: any) {
    term = this.filter.value.toLowerCase();
    if ( term.trim().length !== 0 ) {
      this.listeSms = this.originalListeSms.filter(item =>
        JSON.stringify(item).toLowerCase().includes(term)
      );
    } else {
      this.listeSms = this.originalListeSms;
    }
    this.totalItems = this.listeSms.length;
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
      this.listeSms = this.originalListeSms;
    } else {
      this.listeSms = [...this.originalListeSms].sort((a: any, b: any) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  setToDefaultDate() {
    // this.searchForm.get('debut')?.setValue(this.firstDayOfCurrentMonth);
    // this.searchForm.get('fin')?.setValue(this.maxDate);
    this.searchForm.get('debut')?.setValue(this.datePipe.transform(this.firstDayOfCurrentMonth, 'yyyy-MM-dd'));
    this.searchForm.get('fin')?.setValue(this.datePipe.transform(this.maxDate, 'yyyy-MM-dd'));
  }

}

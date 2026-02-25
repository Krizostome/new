import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';

import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';
import {NgbdSortableHeader} from "../../../directives/ngbd-sortable-header.directive";
import {compare, SortEvent} from "../../../interfaces/sort-event";
import { environment } from 'src/environments/environment';
import { UntypedFormControl } from '@angular/forms';

@Component({
    standalone: false,
    selector: 'app-utilisateur',
    templateUrl: './utilisateur.component.html',
    styleUrls: ['./utilisateur.component.css'],
})
export class UtilisateurComponent implements OnInit {

  listeUser: Array<User> = [];
  user: User=new User();
  closeResult: any;
  originalListeUser: Array<User> = [];
  environment = environment;

  // datatable declaration
  filter = new UntypedFormControl('');
  itemsPerPage: number = 0;
  totalItems: number = 0;
  page: number = 0;
  previousPage: number = 0;
  startPage: number = 0;
  endPage: number = 0;
  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(private utilsService: UtilsService,
    private userService: UserService,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.initDataTable();
    this.getUser();
  }

  getUser(){
    this.ngxService.start();
    this.userService.getListUser().subscribe({
      next: value => {
        if (value && value.data) {
          this.listeUser = value.data;
          this.originalListeUser = this.listeUser;
          this.totalItems = this.originalListeUser.length;
        } else {
          this.listeUser = [];
          this.originalListeUser = [];
          this.totalItems = this.originalListeUser.length;
        }
        this.ngxService.stop();
      },
      error: err =>{
        this.utilsService.handleError(err);
        this.ngxService.stop();
      },
      complete: ()=>{
        this.ngxService.stop();
      }
    })
  }

  deleteUser():void{
    this.ngxService.start();
    this.userService.deleteUser(this.user.id).subscribe({
      next: value => {
        this.utilsService.showSuccessMessage("Utilisateur supprimé avec succès");
        this.getUser();
        this.modalService.dismissAll();
        this.ngxService.stop();
      },
      error: err => {
        this.utilsService.handleError(err);
        this.ngxService.stop();
      },
      complete: () => {
        this.ngxService.stop();
      }
    })

  }

  launchDeleteUserModal(content:any, user: any) {
    this.user = user;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  jumpToUpdateUser(userId: number) {
    this.router.navigate(['/modifier/utilisateur/', userId]);
  }

  jumpToDetailUser(userId: number){
    this.router.navigate(['/detail/utilisateur/', userId])
  }

  searchFilter(term: any) {
    term = this.filter.value.toLowerCase();
    if ( term.trim().length !== 0 ) {
      this.listeUser = this.originalListeUser.filter(item =>
        JSON.stringify(item).toLowerCase().includes(term)
      );
    } else {
      this.listeUser = this.originalListeUser;
    }
    this.totalItems = this.listeUser.length;
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
      this.listeUser = this.originalListeUser;
    } else {
      this.listeUser = [...this.originalListeUser].sort((a: any, b: any) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

}

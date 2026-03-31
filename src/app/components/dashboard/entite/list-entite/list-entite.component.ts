import { Component, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { Entite } from 'src/app/models/entite.model';
import { French } from 'src/app/models/french';
import { EntiteService } from 'src/app/services/entite.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-list-entite',
  standalone: false,
  templateUrl: './list-entite.component.html',
  styleUrl: './list-entite.component.css',
})
export class ListEntiteComponent {

    listeEntites: any;
    public dtOptions: DataTables.Settings = {}; 
    public dtTrigger: Subject<any> = new Subject<any>();

    closeResult: any; entite: Entite = new Entite;
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
      
       constructor(private entiteService: EntiteService, private ngxService: NgxUiLoaderService,  private router: Router,
           private utilsService: UtilsService,  private modalService: NgbModal) { }
        
       ngOnInit(): void {
            this.setFrenchLanguageToDataTable(); 
            this.getListEntite();
       }
        
      getListEntite(): void {
       this.ngxService.start();
       this.entiteService.getEntites().subscribe({
         next: value => {
           if (value && value.data) {
             this.listeEntites = value.data;
             this.dtTrigger.next(null);
           } else {
             this.listeEntites = [];
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

      setFrenchLanguageToDataTable(): void {
         this.dtOptions = {
           language : French.dataTableFrench
         };
       }

  ngOnDestroy(): void {
       this.dtTrigger.unsubscribe();
    }

  ngOnChanges(changes: SimpleChanges): void {
    this.dtTrigger.next(undefined);
  }

  jumpToEntiteEdit(entiteId: number) {
    this.router.navigate(['/entites/modifier/'+entiteId]);
  }


  deleteEntite(entite: any): void {
  this.ngxService.start();
  this.entiteService.deleteEntite(entite.id).subscribe({
    next: () => {
      this.utilsService.showSuccessMessage("Entite supprimé avec succès");
      this.entiteService.getEntites().subscribe(res => {
        this.listeEntites = res.data;
        this.rerender();
      });
      this.modalService.dismissAll();
      this.ngxService.stop();
    },
    error: err => {
      this.utilsService.handleError(err);
      this.ngxService.stop();
    }
  });
}

   open_lg(content:any, entite: any) {
    this.entite = entite;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  rerender(): void {
    if (this.dtElement) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
         dtInstance.destroy(); 
      this.dtTrigger.next(null);
     });
    }
  }


}

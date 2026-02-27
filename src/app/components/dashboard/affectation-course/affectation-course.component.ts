import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { DemandesCoursesService } from 'src/app/services/demandes-courses.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
    standalone: false,
    selector: 'app-affectation-course',
    templateUrl: './affectation-course.component.html',
    styleUrls: ['./affectation-course.component.css'],
})
export class AffectationCourseComponent implements OnInit {

  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject<any>();
  public demandeAffecter: any;

  constructor(private ngxService: NgxUiLoaderService,
    private demandeCourseService: DemandesCoursesService,
    private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.getListCourseAffecter();
  }

  getListCourseAffecter(){
    setTimeout(() => this.ngxService.start());
    this.demandeCourseService.getListDemandeAffecter().subscribe({
      next: value =>{
        this.demandeAffecter = value.data;
        setTimeout(() => this.ngxService.stop());
      },
      error: err =>{
        this.utilsService.handleError(err);
        setTimeout(() => this.ngxService.stop());
      },
      complete: ()=>{
        setTimeout(() => this.ngxService.stop());
      }
    })
  }

}

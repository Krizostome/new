import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import {User} from "../../../models/user";
import {DemandesCoursesService} from "../../../services/demandes-courses.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {ToastrService} from "ngx-toastr";
import {DatePipe} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  user: User | null = new User();

  constructor(public utilsService: UtilsService, private demandesCoursesService: DemandesCoursesService, private ngxService: NgxUiLoaderService,
              private toastr: ToastrService, private datePipe: DatePipe,
              private modalService: NgbModal, private router: Router) { }

  ngOnInit(): void {
    this.user = this.utilsService.getUserConnected();
  }

  checkNotNotedCourseFromUser(): void {
    this.ngxService.start();
    this.demandesCoursesService.checkNotNotedCourseFromUser(this.user?.id).subscribe({
      next: value => {
        if (value.data) {
          this.utilsService.showWarningMessage('Vous avez une course terminée non notée','Attention');
          this.router.navigate(['/demande/notation/' +value.data.id]);
        } else {
          this.router.navigate(['demande/nouveau']);
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

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
    standalone: false,
    selector: 'app-detail-utilisateur',
    templateUrl: './detail-utilisateur.component.html',
    styleUrls: ['./detail-utilisateur.component.css'],
})
export class DetailUtilisateurComponent implements OnInit {

  user! : User;
  userId!: number;
  constructor(private utilsService: UtilsService,
    private activatedRoute: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) =>{
      this.userId = params.userId;
    });
    this.getUserById(this.userId);
  }

  getUserById(userId: number){
    this.ngxService.start();
    this.userService.getUserById(userId).subscribe({
      next: value => {
        this.user = value.data;
        this.ngxService.stop();
      },
      error: err => {
        this.utilsService.handleError(err);
        this.ngxService.stop();
      },
      complete: ()=>{
        this.ngxService.stop();
      }
    });
  }
}

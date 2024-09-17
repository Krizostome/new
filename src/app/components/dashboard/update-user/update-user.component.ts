import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

	formSubmitted =false;
  form: FormGroup;

	user!: User;
  userId!: number;
  constructor(private formBuilder: FormBuilder,
	private ngxService: NgxUiLoaderService,
	private userService: UserService,
	private utilsService: UtilsService,
  private activatedRoute: ActivatedRoute,
  private router: Router) {
    this.form = this.formBuilder.group({
			nom: ['', Validators.required],
			prenom: ['', Validators.required],
			email: ['', Validators.required]
		});
   }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params)=>{
      this.userId = params.userId;
    });
    this.getUserById(this.userId);
  }

  getUserById(userId: any){
    this.ngxService.start();
    this.userService.getUserById(userId).subscribe({
      next: value =>{
        if(value.data !== null){
          console.log(value);
          this.user = value.data;
          this.isUpdatingUser(this.user);
        }
        this.ngxService.stop();
      },
      error: err =>{
        this.ngxService.stop();
        this.utilsService.handleError(err);
      },
      complete: () => {
        this.ngxService.stop();
      }
    });
  }

  isUpdatingUser(user: any){
    this.form.get('nom')?.setValue(user.nom);
    this.form.get('prenom')?.setValue(user.prenom);
    this.form.get('email')?.setValue(user.email);
  }

	onSubmit(){
    this.formSubmitted = true;

      const data = {
        nom: this.form.get('nom')?.value,
        prenom: this.form.get('prenom')?.value,
        email: this.form.get('email')?.value,
        user_id: this.userId
      };

      if(this.form.valid){
        this.updateUser(data);
      }

	}

	updateUser(data: any){
		this.ngxService.start();
		this.userService.updateUser(data).subscribe({
			next: value => {
       this.utilsService.showSuccessMessage('Utilisateur mise a jour avec succes.');
       this.router.navigate(['/liste/utilisateur']);
			 this.ngxService.stop();
			},
			error: err => {
       this.utilsService.handleError(err);
			 this.ngxService.stop();
			},
			complete: ()=>{
				this.ngxService.stop();
			}
		})
	}
}

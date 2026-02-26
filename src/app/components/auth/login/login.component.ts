import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UtilsService} from "../../../services/utils.service";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {LoginService} from "../../../services/login.service";
import {UserService} from "../../../services/user.service";
import { environment } from 'src/environments/environment';

@Component({
    standalone: false,
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  environment = environment;
  loginForm: UntypedFormGroup;
  formSubmitted = false;

  constructor(private router: Router, private loginService: LoginService,
              public utilsService: UtilsService, private ngxService: NgxUiLoaderService,
              private formBuilder: UntypedFormBuilder, private userService: UserService) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['',  Validators.required]
    });
  }

  ngOnInit(): void {
    if(this.utilsService.isConnected()){
      this.router.navigate(['/accueil']);
    }
  }

  submitForm(): void {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      const loginForm: any = {
        email: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value
      };
      this.login(loginForm);
    }

  }


  login(loginForm: any): void {
    this.ngxService.start();
    this.loginService.authenticate(loginForm).subscribe(  {
      next: value => {
        if ([null, undefined].includes(value)){
          this.utilsService.showErreurMessage('', 'Vos paramètres de connexion sont incorrects. Veuillez réessayer');
          this.loginForm.get('password')?.setValue(null);
          this.ngxService.stop();
          return;
        }
        if(value.status === "erreur"){
          this.utilsService.showErreurMessage('', 'Vos paramètres de connexion sont incorrects. Veuillez réessayer');
          this.loginForm.get('password')?.setValue(null);
          this.ngxService.stop();
          return;
        } else {
          // save token
          this.utilsService.saveUserToken(value.access_token);
          // save user
          this.utilsService.saveDataInStorage('user', JSON.stringify(value.user));
          // get user by username
          this.ngxService.stop();
          this.getUserConnectedByUsername(loginForm.email);
        }
      },
      error: err => {

        this.ngxService.stop();
        this.utilsService.showErreurMessage('', this.environment.MESSAGE_ERREUR_INTERNE);
        this.resetLoginForm();
      },
      complete: () => {
      }
    });
  }

  resetLoginForm() { // reset login form
    this.loginForm.get('username')?.setValue('');
    this.loginForm.get('password')?.setValue('');
    this.formSubmitted = false;
  }

  getUserConnectedByUsername(email: string) { // load user by username
    this.ngxService.start();
    this.userService.getUserByUsername(email).subscribe({
      next: value => { // success
        // save user
        this.utilsService.saveDataInStorage('user', JSON.stringify(value.data));
        this.ngxService.stop();
        // this.utilsService.showSuccessMessage('Vous avez été connecté avec succès');
        this.router.navigate(['/demande/encours']);
      },
      error: err => { // erreur
        this.utilsService.showErreurMessage('Erreur interne', environment.MESSAGE_ERREUR_INTERNE);
        this.resetLoginForm();
        this.ngxService.stop();
      },
      complete: () => { // fin de la requete
        this.ngxService.stop();
      }
    });
  }

}

import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {User} from "../models/user";
import { HttpHeaders } from "@angular/common/http";
import {ToastrService} from 'ngx-toastr';
import {NgxUiLoaderService} from "ngx-ui-loader";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  environnement = environment;
  user: User | null = new User();
  ERREUR_401 = 401;
  USER_TOKEN = 'USER_PARC_TOKEN';

  constructor(private ngxService: NgxUiLoaderService, private toastr: ToastrService, private modalService: NgbModal) {

  }

  getHttpPostHeaderForResource() { // les appels de type post simple
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  //enregistre le token de l'utilisateur à sa connection
  public saveUserToken (obj: string): void{
    this.saveToSession(this.USER_TOKEN, obj);
  };

  //retourne le token utilisateur
  public getUserToken(): string {
    return this.readFromSession(this.USER_TOKEN);
  };


  private saveToSession (key: string, value: any): void{
    var stringified = JSON.stringify(value);
    var jsonValue = btoa(stringified);
    localStorage.setItem(key, jsonValue);
  };

  private readFromSession (key: any): any{
    var result = null;
    try{
      var json = localStorage.getItem(key);
      if (json != null) {
        var result = JSON.parse(atob(json));
      }
    }catch(e){
      result = null;
    }
    return result;
  };

  // save data in cookie
  saveDataInStorage(dataName: string, dataValue: any) {
    localStorage.setItem(dataName, dataValue);
  }

  /**
   * Check if the user is connected
   */
  public isConnected(): boolean {
    this.user = this.getUserConnected();
    if (this.user === null) {
      return false;
    }
    return true;
  }

  /**
   * Get the user connected
   */
  getUserConnected(): User | null {
    const user = localStorage.getItem('user');
    if(user != null && user.length > 0 && user !== 'undefined'){
      try {
        return JSON.parse(user);
      } catch (e) {
        console.error('Error parsing user data from storage', e);
        return null;
      }
    }
    return null;
  }

  logout(showLogoutMessage = true): void {
    localStorage.clear();
    // stop all loader before redirect
    window.location.replace('');
    if(showLogoutMessage) {
      this.showSuccessMessage('Vous avez été déconnecté avec succès');
    } else {
      this.showWarningMessage('Vous avez été déconnecté.', 'Session expirée');
    }
  }

  showErreurMessage(title: string, message: string) { // afficher message d'erreur
    this.toastr.error(message, title, {
      closeButton: true,
      timeOut: environment.TIME_OUT_ERREUR_MESSAGE,
      progressBar: true,
      positionClass: 'toast-top-right',
    });
  }

  showSuccessMessage(message: string): void { // afficher message de succès
    this.toastr.success(message, '', {
      closeButton: true,
      timeOut: environment.TIME_OUT_ERREUR_MESSAGE,
      progressBar: true,
      tapToDismiss: false,
      positionClass: 'toast-top-right'
    });
  }

  showWarningMessage(message: string, title: string): void { // afficher message de warning
    this.toastr.warning(message, title, {
      closeButton: true,
      timeOut: environment.TIME_OUT_ERREUR_MESSAGE,
      progressBar: true,
      tapToDismiss: false,
      positionClass: 'toast-top-right'
    });
  }

  /**
   * Gérer les erreurs
   * @param error
   */
  handleError(error: any) {
    if (error.status === this.ERREUR_401) { // UTILISATEUR NON AUTHENTIFIE
      //  this.oauthService.logout();
      // this.logout(false);
    } else { // erreur interne
      this.showErreurMessage('Erreur interne', environment.MESSAGE_ERREUR_INTERNE);
    }
  }

  /**
   * Numéric only allowed
   * @param $event
   */
  numericOnly($event: KeyboardEvent) {
    let pattern = /^([0-9])$/;
    return pattern.test($event.key);
  }

  isAdmin(): boolean {
    return this.isConnected() && this.user?.role?.libelle === environment.ROLE_ADMIN;
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

}

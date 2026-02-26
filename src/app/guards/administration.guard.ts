import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {UtilsService} from "../services/utils.service";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AdministrationGuard  {

  constructor(private utilsService: UtilsService, private toastrService: ToastrService, private router: Router) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.utilsService.isConnected() && !this.utilsService.isAdmin()) {
      // this.utilsService.logout();
      this.toastrService.warning('Vous n\'êtes pas autorisé à accéder à cette page');
      this.router.navigate(['accueil']);
      return false;
    }
    return true;
  }

}

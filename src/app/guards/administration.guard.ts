import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UtilsService } from '../services/utils.service';
import { ToastrService } from 'ngx-toastr';

export const administrationGuard: CanActivateFn = (route, state) => {
  const utilsService = inject(UtilsService);
  const toastrService = inject(ToastrService);
  const router = inject(Router);

  if (utilsService.isConnected() && !utilsService.isAdmin()) {
    toastrService.warning('Vous n\'êtes pas autorisé à accéder à cette page');
    router.navigate(['accueil']);
    return false;
  }
  return true;
};

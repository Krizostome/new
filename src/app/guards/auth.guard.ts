import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UtilsService } from '../services/utils.service';

export const authGuard: CanActivateFn = (route, state) => {
  const utilsService = inject(UtilsService);
  if (!utilsService.isConnected()) {
    utilsService.logout();
    return false;
  }
  return true;
};

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as bootstrap from 'bootstrap';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el as HTMLElement));
    });
  })
  .catch(err => console.error(err));
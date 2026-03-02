import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { GoogleMapsModule } from '@angular/google-maps';
import { DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { TestBed } from '@angular/core/testing';

import { ApiInterceptor } from './api.interceptor';

describe('ApiInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot(), HttpClientTestingModule, RouterTestingModule, ToastrModule.forRoot(), HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule, FormsModule, NgbModule, GoogleMapsModule, NgSelectModule, DataTablesModule],
    providers: [
      ApiInterceptor
      , DatePipe]
  }));

  it('should be created', () => {
    const interceptor: ApiInterceptor = TestBed.inject(ApiInterceptor);
    expect(interceptor).toBeTruthy();
  });
});

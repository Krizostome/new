import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { GoogleMapsModule } from '@angular/google-maps';
import { DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { TestBed } from '@angular/core/testing';

import { ChauffeursService } from './chauffeurs.service';

describe('ChauffeursService', () => {
  let service: ChauffeursService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatePipe],
      imports: [ToastrModule.forRoot(), HttpClientTestingModule, RouterTestingModule, ToastrModule.forRoot(), HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule, FormsModule, NgbModule, GoogleMapsModule, NgSelectModule, DataTablesModule],});
    service = TestBed.inject(ChauffeursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEntiteComponent } from './list-entite.component';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ListEntiteComponent', () => {
  let component: ListEntiteComponent;
  let fixture: ComponentFixture<ListEntiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListEntiteComponent, ToastrModule.forRoot(), HttpClientTestingModule, RouterTestingModule, ToastrModule.forRoot(), HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule, FormsModule, NgbModule, GoogleMapsModule, NgSelectModule, DataTablesModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListEntiteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { GoogleMapsModule } from '@angular/google-maps';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JournalSmsComponent } from './journal-sms.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PaginationSlicePipe } from '../../../pipes/pagination-slice.pipe';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('JournalSmsComponent', () => {
  let component: JournalSmsComponent;
  let fixture: ComponentFixture<JournalSmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JournalSmsComponent, PaginationSlicePipe ],
      imports: [ ToastrModule.forRoot(), HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule, FormsModule, NgbModule , ToastrModule.forRoot(), HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule, FormsModule, NgbModule, GoogleMapsModule, NgSelectModule, DataTablesModule],
      providers: [ DatePipe , DatePipe]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

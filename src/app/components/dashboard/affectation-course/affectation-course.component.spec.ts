import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { GoogleMapsModule } from '@angular/google-maps';
import { DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectationCourseComponent } from './affectation-course.component';

describe('AffectationCourseComponent', () => {
  let component: AffectationCourseComponent;
  let fixture: ComponentFixture<AffectationCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [DatePipe],
      imports: [ToastrModule.forRoot(), HttpClientTestingModule, RouterTestingModule, ToastrModule.forRoot(), HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule, FormsModule, NgbModule, GoogleMapsModule, NgSelectModule, DataTablesModule],
    declarations: [AffectationCourseComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectationCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

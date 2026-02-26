import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { EmptyComponent } from './components/partials/empty/empty.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { FooterComponent } from './components/partials/footer/footer.component';
import { SidebarComponent } from './components/partials/sidebar/sidebar.component';
import { AccueilComponent } from './components/dashboard/accueil/accueil.component';
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { DemandesCoursesComponent } from './components/dashboard/demandes-courses/demandes-courses.component';
import {provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS} from "@angular/common/http";
import {DataTablesModule} from "angular-datatables";
import {ToastrModule} from "ngx-toastr";
import { NgSelectModule } from '@ng-select/ng-select';
import {
  NgbModule, NgbPaginationModule
} from '@ng-bootstrap/ng-bootstrap';
import { AddDemandeCourseComponent } from './components/dashboard/add-demande-course/add-demande-course.component';
import { LoginComponent } from './components/auth/login/login.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { VehiculesComponent } from './components/dashboard/vehicules/vehicules.component';
import { AddVehiculeComponent } from './components/dashboard/add-vehicule/add-vehicule.component';
import {NgxUiLoaderModule} from "ngx-ui-loader";
import { AddChauffeurComponent } from './components/dashboard/add-chauffeur/add-chauffeur.component';
import {DatePipe, HashLocationStrategy, LocationStrategy} from "@angular/common";
import { PalnningGardeComponent } from './components/dashboard/palnning-garde/palnning-garde.component';
import { AddPalnningGardeComponent } from './components/dashboard/add-palnning-garde/add-palnning-garde.component';
import { ChauffeursComponent } from './components/dashboard/chauffeurs/chauffeurs.component';
import { DetailsDemandeComponent } from './components/dashboard/details-demande/details-demande.component';
import { DetailsVehiculeComponent } from './components/dashboard/details-vehicule/details-vehicule.component';
import { DetailsChauffeurComponent } from './components/dashboard/details-chauffeur/details-chauffeur.component';
import { AffectationCourseComponent } from './components/dashboard/affectation-course/affectation-course.component';
import { UtilisateurComponent } from './components/dashboard/utilisateur/utilisateur.component';
import { UpdateUserComponent } from './components/dashboard/update-user/update-user.component';
import { DetailUtilisateurComponent } from './components/dashboard/detail-utilisateur/detail-utilisateur.component';
import { NoteCourseComponent } from './components/dashboard/note-course/note-course.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapsComponent } from './components/dashboard/maps/maps.component';
import {NgbdSortableHeader} from './directives/ngbd-sortable-header.directive';
import { PaginationSlicePipe } from './pipes/pagination-slice.pipe';
import { DemandesEnCoursComponent } from './components/dashboard/demandes-en-cours/demandes-en-cours.component';
import { HistoriqueDemandesComponent } from './components/dashboard/historiques/historique-demandes/historique-demandes.component';
import { HistoriqueChauffeursComponent } from './components/dashboard/historiques/historique-chauffeurs/historique-chauffeurs.component';
import { UrlPipe } from './pipes/url.pipe';
import {ApiInterceptor} from "./interceptors/api.interceptor";
import {BnNgIdleService} from "bn-ng-idle";
import { JournalSmsComponent } from './components/dashboard/journal-sms/journal-sms.component';

@NgModule({
  declarations: [
    AppComponent,MainComponent,EmptyComponent,HeaderComponent,
    FooterComponent,SidebarComponent,AccueilComponent,DemandesCoursesComponent,
    AddDemandeCourseComponent,LoginComponent,VehiculesComponent,AddVehiculeComponent,
    AddChauffeurComponent,PalnningGardeComponent,AddPalnningGardeComponent,
    ChauffeursComponent,AddChauffeurComponent,DetailsDemandeComponent,DetailsVehiculeComponent,
    DetailsChauffeurComponent,AffectationCourseComponent,UtilisateurComponent,UpdateUserComponent,
    DetailUtilisateurComponent,NoteCourseComponent,MapsComponent,NgbdSortableHeader,PaginationSlicePipe,
    DemandesEnCoursComponent,HistoriqueDemandesComponent,HistoriqueChauffeursComponent,UrlPipe,JournalSmsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DataTablesModule,
    NgbModule,
    NgSelectModule,
    NgxUiLoaderModule,
    NgbPaginationModule,
    ToastrModule.forRoot({
      preventDuplicates: true
    }),
    GoogleMapsModule,

  ],
  providers: [
    DatePipe, BnNgIdleService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true},
    provideHttpClient(withInterceptorsFromDi()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

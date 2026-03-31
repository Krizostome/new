import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from "./components/main/main.component";
import { AccueilComponent } from "./components/dashboard/accueil/accueil.component";
import { DemandesCoursesComponent } from "./components/dashboard/demandes-courses/demandes-courses.component";
import { AddDemandeCourseComponent } from "./components/dashboard/add-demande-course/add-demande-course.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { VehiculesComponent } from './components/dashboard/vehicules/vehicules.component';
import { AddVehiculeComponent } from './components/dashboard/add-vehicule/add-vehicule.component';
import { ChauffeursComponent } from './components/dashboard/chauffeurs/chauffeurs.component';
import { AddChauffeurComponent } from './components/dashboard/add-chauffeur/add-chauffeur.component';
import { PalnningGardeComponent } from './components/dashboard/palnning-garde/palnning-garde.component';
import { AddPalnningGardeComponent } from './components/dashboard/add-palnning-garde/add-palnning-garde.component';
import {DetailsDemandeComponent} from "./components/dashboard/details-demande/details-demande.component";
import { DetailsVehiculeComponent } from './components/dashboard/details-vehicule/details-vehicule.component';
import { DetailsChauffeurComponent } from './components/dashboard/details-chauffeur/details-chauffeur.component';
import { AffectationCourseComponent } from './components/dashboard/affectation-course/affectation-course.component';
import { UtilisateurComponent } from './components/dashboard/utilisateur/utilisateur.component';
import { UpdateUserComponent } from './components/dashboard/update-user/update-user.component';
import { DetailUtilisateurComponent } from './components/dashboard/detail-utilisateur/detail-utilisateur.component';
import { NoteCourseComponent } from './components/dashboard/note-course/note-course.component';
import { MapsComponent } from './components/dashboard/maps/maps.component';
import {DemandesEnCoursComponent} from "./components/dashboard/demandes-en-cours/demandes-en-cours.component";
import { HistoriqueDemandesComponent } from './components/dashboard/historiques/historique-demandes/historique-demandes.component';
import { HistoriqueChauffeursComponent } from './components/dashboard/historiques/historique-chauffeurs/historique-chauffeurs.component';
import {authGuard} from "./guards/auth.guard";
import {administrationGuard} from "./guards/administration.guard";
import {JournalSmsComponent} from "./components/dashboard/journal-sms/journal-sms.component";
import { AddUserComponent } from './components/dashboard/add-user/add-user.component';
import { AddEntiteComponent } from './components/dashboard/entite/add-entite/add-entite.component';
import { ListEntiteComponent } from './components/dashboard/entite/list-entite/list-entite.component';
import { UpdateEntiteComponent } from './components/dashboard/entite/update-entite/update-entite.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: '', canActivate: [authGuard], component: MainComponent, children: [


      {path:'demande/notation/:demandeId',component:NoteCourseComponent},
      { path: 'accueil', component: AccueilComponent },
      { path: 'demande/historique', component: DemandesCoursesComponent },
      { path: 'demande/nouveau', component: AddDemandeCourseComponent },
      { path: 'demande/modifier/:demandeId', component: AddDemandeCourseComponent },
      { path: 'demande/details/:demandeId', component: DetailsDemandeComponent },
      { path: 'list/course-affecter', component: AffectationCourseComponent },
      { path: 'maps', component: MapsComponent },
      { path: 'demande/encours', component: DemandesEnCoursComponent },
      { path: 'liste/utilisateur', canActivate: [administrationGuard], component: UtilisateurComponent },
      { path: 'ajout/utilisateur', canActivate: [administrationGuard], component: AddUserComponent },
      { path: 'modifier/utilisateur/:userId', canActivate: [administrationGuard], component: UpdateUserComponent },
      { path: 'detail/utilisateur/:userId', canActivate: [administrationGuard], component: DetailUtilisateurComponent },

    ]
  },

  {
    path: '',canActivate: [authGuard,administrationGuard], component: MainComponent, children: [

      { path: 'vehicules', component: VehiculesComponent },
      { path: 'vehicule/ajouter', component: AddVehiculeComponent },
      { path: 'vehicule/modifier/:vehiculeId', component: AddVehiculeComponent },
      { path: 'vehicule/details/:vehiculeId', component: DetailsVehiculeComponent },

    ]
  },

  {
    path: '',canActivate: [authGuard,administrationGuard], component: MainComponent, children: [

      { path: 'chauffeurs', component: ChauffeursComponent },
      { path: 'chauffeur/ajouter', component: AddChauffeurComponent },
      { path: 'chauffeur/modifier/:chauffeurId', component: AddChauffeurComponent },
      { path: 'chauffeur/details/:chauffeurId', component: DetailsChauffeurComponent },

    ]
  },

  {
    path: '',canActivate: [authGuard,administrationGuard], component: MainComponent, children: [

      { path: 'planning-gardes', component: PalnningGardeComponent },
      { path: 'planning-garde/ajouter', component: AddPalnningGardeComponent },
      { path: 'planning-garde/modifier/:planningId', component: AddPalnningGardeComponent },

    ]
  },

  {
    path: '',canActivate: [authGuard,administrationGuard], component: MainComponent, children: [

      { path: 'historique/demandes', component: HistoriqueDemandesComponent },
      { path: 'historique/chauffeurs', component: HistoriqueChauffeursComponent },
      { path: 'statistiques/sms', component: JournalSmsComponent },

    ]
  },
  {
    path: '',canActivate: [authGuard,administrationGuard], component: MainComponent, children: [

      { path: 'entites', component: ListEntiteComponent },
      { path: 'entites/ajouter', component: AddEntiteComponent },
      { path: 'entites/modifier/:entiteId', component: UpdateEntiteComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

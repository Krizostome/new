import {User} from "./user";
import {Motif} from "./motif";
import {TypeVehicule} from "./type-vehicule";
import {AffectationDemande} from "./affectation-demande";

export class DemandeVehicule {
  id: number = 0;
  reference: string = '';
  objet: string = '';
  date: string = '';
  point_depart: string = '';
  point_destination: string = '';
  nbre_personnes: number = 0;
  statut: string = '';
  escales: string = '';
  user: User = new User();
  beneficiaire: User = new User();
  beneficiaire_id: number = 0;
  motif: Motif = new Motif();
  is_note:boolean = false;
  date_depart: string = '';
  date_retour: string = '';
  heure_depart: string = '';
  heure_retour: string = '';
  type_vehicule: TypeVehicule = new TypeVehicule();
  affectation: AffectationDemande | undefined;
}

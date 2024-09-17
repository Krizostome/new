import {Vehicule} from "./vehicule";
import {DemandeVehicule} from "./demande-vehicule";
import {Chauffeur} from "./chauffeur";

export class AffectationDemande {
  id: number = 0;
  vehicule: Vehicule = new Vehicule();
  demande_vehicule: DemandeVehicule =new DemandeVehicule();
  chauffeur: Chauffeur = new Chauffeur();
}

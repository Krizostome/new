import {TypeVehicule} from "./type-vehicule";

export class Vehicule {
  id: number = 0;
  immatr?: string;
  marque?: string;
  date_mise_circulation?: Date;
  disponibilite?: string;
  capacite?: string;
  created_by?: number = 1;
  updated_by?: number = 1;
  statut?: boolean = true;
  type_vehicule?: TypeVehicule = new TypeVehicule();
}

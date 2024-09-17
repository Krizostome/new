import { Chauffeur } from "./chauffeur";
import { User } from "./user";

export class PlannigGarde {
  id: number = 0;
  date_debut = '';
  date_fin: string = '';
  heure_debut = '';
  heure_fin: string = '';
  statut: boolean = true;
  created_by: any = 1;
  updated_by: any;
  created_at: any;
  updated_at: any;
  chauffeurs: Array<Chauffeur> = [];
}

import { CategoriePermis } from "./categorie-permis";
import {User} from "./user";

export class Chauffeur {
  id: number = 0;
  matricule: number = 0;
  annee_permis: number = 0;
  disponibilite: string = '';
  adresse: string = '';
  num_permis: string = '';
  contact: string = '';
  email: string = '';
  statut: boolean = true;
  created_by?: number = 1;
  updated_by?: number = 1;
  created_at?: Date ;
  updated_at?: Date ;
  user_id: User = new User();
  categorie_permis_id: CategoriePermis = new CategoriePermis();
  user: User | undefined;
  permis: CategoriePermis | undefined;
}

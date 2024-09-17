import {Role} from "./role";
import {CategorieUser} from "./categorie-user";
import {Direction} from "./direction";

export class User {
  id: number = 0;
  nom: string = '';
  prenom: string = '';
  email: string = '';
  tel: number = 0;
  statut: boolean = false;
  role: Role = new Role();
  categorie_user: CategorieUser = new CategorieUser();
  direction: Direction = new Direction();
}

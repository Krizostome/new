import {CategoriePermis} from "./categorie-permis";
import {Vehicule} from "./vehicule";

export class ConduiteDemande {
  id: number = 0;
  categorie_permis: CategoriePermis = new CategoriePermis();
  vehicule: Vehicule = new Vehicule();
}

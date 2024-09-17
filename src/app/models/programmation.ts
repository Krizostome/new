import {Chauffeur} from "./chauffeur";
import {PlannigGarde} from "./plannig-garde";

export class Programmation {
  id: number = 0;
  chauffeur: Chauffeur = new Chauffeur();
  planning_garde_id: PlannigGarde = new PlannigGarde();
  date_fin_repos: string = '';
}

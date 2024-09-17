import { DemandeVehicule } from "./demande-vehicule";
import { User } from "./user";

export class Notation {
    id:number=0;
    demande_vehicule_id:DemandeVehicule=new DemandeVehicule();
    commentaire:string='';
    date_de_notation:Date=new Date();
    user_id:User=new User();
}

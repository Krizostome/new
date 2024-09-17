import { CritereNotation } from "./critere-notation";
import { Notation } from "./notation";

export class LigneNotation {
    id:number=0;
    notation_id:Notation=new Notation();
    critere_notation_id: CritereNotation=new CritereNotation();

    valeur:number=0;
}

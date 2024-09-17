import { FormControl, Validators } from "@angular/forms";

export class CritereNotation {
  id: number = 0;
  libelle: string = '';
  stars:FormControl = new FormControl(0);
}

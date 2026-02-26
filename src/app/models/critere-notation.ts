import { UntypedFormControl, Validators } from "@angular/forms";

export class CritereNotation {
  id: number = 0;
  libelle: string = '';
  stars:UntypedFormControl = new UntypedFormControl(0);
}

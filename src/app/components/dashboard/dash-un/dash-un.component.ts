import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dash-un',
  imports: [],
  templateUrl: './dash-un.component.html',
  styleUrl: './dash-un.component.css',
})
export class DashUnComponent {

  @Input() value!: string;
  @Input() title!: string;
  @Input() icon!: string;
  @Input() bg!: string;
  @Input() color!: string;

}

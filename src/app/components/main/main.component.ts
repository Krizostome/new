import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    standalone: false,
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {

  environment = environment;

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css'],
})
export class MapsComponent implements OnInit {
  title: string = 'AGM project';
  latitude = 51.678418;
  longitude = 7.809007;
  constructor() { }

  ngOnInit(): void {
  }

}

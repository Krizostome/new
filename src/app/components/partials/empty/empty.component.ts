import { Component, OnInit } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-empty',
    templateUrl: './empty.component.html',
    styleUrls: ['./empty.component.css'],
})
export class EmptyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

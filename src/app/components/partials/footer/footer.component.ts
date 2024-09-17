import { CoreEnvironment } from '@angular/compiler/src/compiler_facade_interface';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  environment = environment;
  public year: number | undefined;

  constructor() { }

  ngOnInit(): void {

    this.year = (new Date()).getFullYear();
  }

}

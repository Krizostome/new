import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {UtilsService} from "../../../services/utils.service";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {User} from "../../../models/user";
import {environment} from "../../../../environments/environment";
import {BnNgIdleService} from "bn-ng-idle";

@Component({
    standalone: false,
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  environment = environment;
  user: User | null = new User();
  constructor(private utilsService: UtilsService, private ngxService: NgxUiLoaderService,
              private bnIdle: BnNgIdleService) { }

  ngOnInit(): void {
    if(this.utilsService.isConnected()) {
      this.user = this.utilsService.getUserConnected();
      this.bnIdle.startWatching(environment.SECOND_TIME_LOGOUT).subscribe((isTimedOut: boolean) => {
        if (isTimedOut) {
          this.utilsService.showWarningMessage('Vous avez été déconnecté', 'Session expirée');
          this.disconnect();
        }
      });
    }
  }


  disconnect() {
    this.utilsService.logout();
  }

}

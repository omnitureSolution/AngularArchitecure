import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './features-modules/auth/auth.service';
import { Router, RouterEvent, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { LoaderService } from '@shared/utility/loader.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app',
  templateUrl: 'app-component.html'
})
export class AppComponent {
  public isShowingRouteLoadIndicator: boolean;
  constructor(router: Router,private loaderService: LoaderService) {
    this.isShowingRouteLoadIndicator = false;
    var asyncLoadCount = 0;
    router.events.subscribe((event: RouterEvent): void => {
      if (event instanceof RouteConfigLoadStart) {
        asyncLoadCount++;
      } else if (event instanceof RouteConfigLoadEnd) {
        asyncLoadCount--;
      }
      this.isShowingRouteLoadIndicator = !!asyncLoadCount;
    });
  }
}

import { Component, HostListener, Inject } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';



@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  showNavigation = false;
  bodyClassList;
  isMobile;

  // page/url
  pageType: string;

  // tslint:disable-next-line: variable-name
  _routerSubscription: Subscription;

  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private deviceService: DeviceDetectorService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isMobile = deviceService.isMobile();
    router.events.pipe(
      filter(e => e instanceof NavigationEnd))
        .subscribe((e: NavigationEnd) => this.setPageType(e.url as string));
    this.bodyClassList = this.document.body.classList;
  }

  setPageType(url: string) {
    if (typeof url === 'undefined' || url === '/') { this.pageType = 'home';
    } else if (url.includes('cms')) { this.pageType = 'cms';
    } else if (url.includes('about-me')) { this.pageType = 'about-me';
    } else { this.pageType = 'work'; }
    console.log(url);

  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    // In chrome and some browser scroll is given to body tag
    const pos = (this.document.documentElement.scrollTop || this.document.body.scrollTop);
    const max = 480;
    // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
    if (pos >= max) {
      this.bodyClassList.contains('navigation--open') ? null : this.bodyClassList.add('navigation--open');
    } else {
      this.bodyClassList.contains('navigation--open') ? this.bodyClassList.remove('navigation--open') : null;
    }
  }
}

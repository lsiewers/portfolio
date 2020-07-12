import {
  Component,
  ChangeDetectorRef,
  AfterContentChecked,
  HostListener,
  Input,
  OnDestroy,
  AfterContentInit,
  Inject,
} from '@angular/core';
import { Item } from '../../models/item';
import { Filter } from '../../models/filter';
import Bricks from 'bricks.js';
import { Router, ActivatedRoute } from '@angular/router';
import { FiltersService } from 'src/app/services/filters.service';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements AfterContentInit, AfterContentChecked, OnDestroy {
  @Input() projectFilter: Filter;
  @Input() projectTitle: string;

  // filters
  activeFilters: Filter[] = [];
  filters: Filter[] = [];
  focuses = [];

  // items
  items: Item[];

  previewOverlay = false;
  previewOverlayColor: string;
  bodyClassList;

  // page/url
  pageType: string;

  // tslint:disable-next-line: variable-name
  _routerSubscription: Subscription;

  // masonry
  bricks: Bricks.Instance;
  loadedImages = 0;
  showAmount = 5;
  suggested = false;


  constructor(
    private changeDetector: ChangeDetectorRef,
    private filtersService: FiltersService,
    private activeRouter: ActivatedRoute,
    private router: Router,
    private deviceService: DeviceDetectorService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.bodyClassList = document.body.classList;
  }

   // lifecycle hooks
  ngAfterContentChecked() { this.changeDetector.detectChanges(); }

  ngAfterContentInit(): void {
    this.setPageType();
    this.pageType === 'work' ?
      this.toggleFilter({ type: 'focus', values: this.projectFilter.values }) :
      this.filtersService.getFilters().then(filters => {
        this.filters = filters;
        this.focuses = filters.find(filter => filter.type === 'focus').values;
      });
    this.getFilteredItems();
  }

  isActiveFilter(type: string, value: string) {
    const filteredType = this.activeFilters.find(activeFilter => activeFilter.type === type);
    return typeof filteredType === 'undefined' ?
              false :
              (filteredType.values as string[]).includes(value);
  }

  // filter methods
  // filter tab (open/close)
  toggleFilterTab(filter: Filter) {
    if (!filter.openTab) {
      let delay: boolean;
      this.filters.find(f => f.openTab === true) ? delay = true : delay = false;
      this.filters.forEach(f => {
        if (f.openTab === undefined) { f.openTab = false; }
        if (f !== filter) { f.openTab ? f.openTab = false : f.openTab = true;
        } else if (delay) { setTimeout(() => f.openTab = true, 480);
        } else { f.openTab = true; }
      });
    } else { filter.openTab = false; }
  }

  toggleFilter(filter: Filter) {
    this.activeFilters = this.filtersService.toggleFilter(filter, this.activeFilters);
    this.getFilteredItems();
  }

  getFilteredItems(): Promise<any> {
    return this.filtersService.getFilteredItems(this.activeFilters).then(data => {
      this.pageType === 'work' ?
        this.items = data.filter(item => item.title !== this.projectTitle) :
        this.items = data;
      this.items.sort((a: Item, b: Item) =>
        new Date(b.metadata.finishDate).getTime() - new Date(a.metadata.finishDate).getTime());
      // this.items.forEach(item => console.log(item.metadata.tools))
    });
  }

  // all focuses tab functions
  removeFocusFilters() {
    if (this.activeFilters.length !== 0) {
      const activeFocus = this.activeFilters.find(f => f.type === 'focus');
      if (typeof activeFocus !== 'undefined') {
        activeFocus.values.forEach(value => this.toggleFilter({type: 'focus', values: [value]}));
      }
    }
  }

  focusFilterActive() {
    if (this.activeFilters.length === 0) {
       return false;
     } else {
        const activeFocus = this.activeFilters.find(f => f.type === 'focus');
        if (typeof activeFocus === 'undefined') {
          return false;
        } else {
          return activeFocus.values.length === 0 ? false : activeFocus.values[0];
        }
     }
  }

  setPageType() {
    this._routerSubscription = this.activeRouter.url.subscribe(params => {
      const url = params.length ? params[0].path : undefined;

      if (typeof url === 'undefined') { this.pageType = 'home';
      } else if (url.includes('cms')) { this.pageType = 'cms';
      } else {
        this.pageType = 'work';
        this.getFilteredItems();
        this.previewOverlay = false;
        document.querySelector('html').style.overflow = 'auto';
      }
    });
  }

  valuesCategorized(valuesList: Array<any>): boolean {
    return !!(valuesList[0] instanceof Object);
  }

  loadMasonry() {
    this.bricks = Bricks({
      container: '.work__items__list',
      packed: 'packed',
      sizes: [
        { mq: '780px', columns: 2, gutter: 24 },
        { mq: '960px', columns: 2, gutter: 36 },
        { mq: '1200px', columns: 3, gutter: 24 },
        { mq: '1400px', columns: 3, gutter: 36 }
      ]
    });
    this.bricks.pack();
  }

  routeToPost(title: string) {
    const postUrl = title.toLowerCase().split(' ').join('-');

    this.router.navigate([this.pageType === 'cms' ? 'cms/' + postUrl
    : postUrl]);
    document.querySelector('html').style.overflow = 'auto';
  }

  imageLoaded(item: Item) {
    this.loadedImages++;
    const toLoad = this.items.length < this.showAmount ? this.items.length : this.showAmount;

    if (this.loadedImages >= toLoad) { this.loadMasonry(); }
  }

  // Animations
  hoverAnimation(e: MouseEvent, isPreview: boolean) {
    if (isPreview === undefined || !isPreview && !(this.deviceService.isMobile()) && !(this.deviceService.isTablet())) {
      const target: HTMLElement = e.currentTarget as HTMLElement;

      const sensitivity = 0.06;
      const x = (e.offsetX - target.offsetWidth / 2) * sensitivity;
      const y = (e.offsetY - target.offsetHeight / 2) * sensitivity;

      target.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(1.05) rotateX(${-y * 0.75}deg) rotateY(${x * 0.75}deg)`;
    }
  }

  hoverLeave(e: MouseEvent, isPreview: boolean) {
    if (isPreview === undefined || !isPreview) {
      this.resetTransform(e.currentTarget as HTMLElement);
    }
  }

  resetTransform(item: HTMLElement) {
    item.style.transform = 'translate3d(0px, 0px, 0px) scale(1) rotateX(0deg) rotateY(0deg)';
    item.scrollTo(0, 0);
  }

  toPreviewAnimation(e: MouseEvent, item: Item) {
    this.previewOverlay = true;
    this.previewOverlayColor = item.palette.secondary;
    this.bodyClassList.contains('navigation--open') ? this.bodyClassList.remove('navigation--open') : null;

    const target: HTMLElement = e.currentTarget as HTMLElement;

    // width of screen, element to center
    // minus container's left and item's masonry position
    const x =
      window.innerWidth / 2 -
      target.clientWidth / 2 -
      target.parentElement.offsetLeft -
      target.offsetLeft;


    // minus container top position + item's height / margin to set at top of screen
    // + scrollposition of htmlEL and minus masonry position
    const y = -target.parentElement.offsetTop + window.scrollY - target.offsetTop + 90;
    const scale: number = this.deviceService.isMobile() || this.deviceService.isTablet() ? 1.05 : 1.2;
    target.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(${scale}) rotateX(0deg) rotateY(0deg)`;
    document.querySelector('html').style.overflow = 'hidden';

    item.workPreview = true;
  }

  closePreview(item: Item, el?: HTMLElement, i?: number) {
    el === null ?
      el = document.querySelectorAll('.work__items__list__item')[i] as HTMLElement :
      el = el;

    this.resetTransform(el);
    this.previewOverlay = false;
    item.workPreview = false;
    document.querySelector('html').style.overflow = 'auto';
    this.bodyClassList.contains('navigation--open') ? null : this.bodyClassList.add('navigation--open');
  }

  // Resize update
  @HostListener('window:resize')
  bricksUpdate() { this.bricks.resize(); }

  ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
  }
}

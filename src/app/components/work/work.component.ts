import {
  Component,
  ChangeDetectorRef,
  AfterContentChecked,
  HostListener,
  Input,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Item } from '../../models/item';
import { Filter } from '../../models/filter';
import Bricks, { BricksInstance } from 'bricks.js';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkService } from 'src/app/services/work.service';
import { FiltersService } from 'src/app/services/filters.service';
import { isUndefined, isNull } from 'util';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements AfterViewInit, AfterContentChecked, OnDestroy {
  @Input() projectFilter: Filter;

  // filters
  activeFilters: Filter[] = [];
  filters: Filter[] = [];

  // items
  items: Item[];

  previewOverlay = false;

  // page/url
  pageType: string;
  projectTitle: string;
  // tslint:disable-next-line: variable-name
  _routerSubscription: Subscription;

  // masonry
  bricks: BricksInstance;
  loadedImages = 0;
  showAmount = 3;
  suggested = false;


  constructor(
    private changeDetector: ChangeDetectorRef,
    private workService: WorkService,
    private filtersService: FiltersService,
    private activeRouter: ActivatedRoute,
    private router: Router
  ) {}

   // lifecycle hooks
  ngAfterContentChecked() { this.changeDetector.detectChanges(); }

  ngAfterViewInit(): void {
    this.setPageType();
    this.pageType === 'work' ?
      this.toggleFilter({ type: 'focus', values: this.projectFilter.values }) :
      this.filtersService.getFilters().then(filters => this.filters = filters);
    this.getFilteredItems();
  }

  isActiveFilter(type: string, value: string) {
    const filteredType = this.activeFilters.find(activeFilter => activeFilter.type === type);
    return typeof filteredType === 'undefined' ? false : filteredType.values.includes(value);
  }

  // filter methods
  // filter tab (open/close)
  toggleFilterTab(filter: Filter) {
    const activatedTabs = [];
    if (!filter.openTab) {
      let delay;
      this.filters.find(f => f.openTab === true) ? delay = true : delay = false;
      this.filters.forEach(f => {
        if (f.openTab === undefined) { f.openTab = false; }
        // tslint:disable-next-line: no-unused-expression
        if (f !== filter) { f.openTab ? f.openTab = false : null;
        } else if (delay) {
          setTimeout(() => f.openTab = true, 480);
        } else { f.openTab = true; }

        activatedTabs.push(f.openTab);
      });
    } else { filter.openTab = false; }
  }

  toggleFilter(filter: Filter) { this.activeFilters = this.filtersService.toggleFilter(filter, this.activeFilters); }

  getFilteredItems() {
    this.filtersService.getFilteredItems(this.activeFilters).then(data => {
      this.pageType === 'work' ?
        this.items = data.filter(item => item.title !== this.projectTitle) :
        this.items = data;
    });
  }

  // set-up
  // async getItems(): Promise<Item[]> {
  //   return await new Promise((resolve) => {
  //     this.workService.getWorkList()
  //       .then(data => resolve(data));
  //     });
  // }

  setPageType() {
    this._routerSubscription = this.activeRouter.url.subscribe(params => {
      const url = params.length ? params[0].path : undefined;

      if (typeof url === 'undefined') { this.pageType = 'home';
      } else if (url.includes('cms')) { this.pageType = 'cms';
      } else {
        this.pageType = 'work';
        this.projectTitle = decodeURI(url);
      }
    });
  }

  // check if categorized or not
  valuesCategorized(valuesList: Array<any>): boolean {
    return !!(valuesList[0] instanceof Object);
  }

  loadMasonry() {
    this.bricks = Bricks({
      container: '.work__items__list',
      packed: 'packed',
      sizes: [
        { mq: '820px', columns: 2, gutter: 36 },
        { mq: '900px', columns: 2, gutter: 60 },
        { mq: '1280px', columns: 3, gutter: 36 },
        { mq: '1400px', columns: 3, gutter: 60 }
      ]
    });
    this.bricks.pack();
  }

  // Other
  projectDetailRoute(e: string, projectFilter: Filter) {
    this.projectTitle = decodeURI(e).substr(1);
  }

  routeToPost(title: string) {
    this.router.navigate([this.pageType === 'cms' ? 'cms/' + title
    : title]);
  }

  imageLoaded(item: Item) {
    this.loadedImages++;

    if (this.loadedImages >= this.items.length) { this.loadMasonry(); }
  }

  // Animations
  hoverAnimation(e: MouseEvent, isPreview: boolean) {
    console.log(isPreview);

    if (isUndefined(isPreview) || !isPreview) {
      const target: HTMLElement = e.currentTarget as HTMLElement;

      const sensitivity = 0.1;
      const x = (e.offsetX - target.offsetWidth / 2) * sensitivity;
      const y = (e.offsetY - target.offsetHeight / 2) * sensitivity;

      target.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(1.05) rotateX(${-y * 0.75}deg) rotateY(${x * 0.75}deg)`;
    }
  }

  hoverLeave(e: MouseEvent, isPreview: boolean) {
    if (isUndefined(isPreview) || !isPreview) {
      this.resetTransform(e.currentTarget as HTMLElement);
    }
  }

  resetTransform(item: HTMLElement) {
    item.style.transform = 'translate3d(0px, 0px, 0px) scale(1) rotateX(0deg) rotateY(0deg)';
  }

  toPreviewAnimation(e: MouseEvent, item: Item) {
    this.previewOverlay = true;

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
    const y = -target.parentElement.offsetTop + target.clientHeight / 2 + window.scrollY - target.offsetTop;

    target.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(1.2) rotateX(0deg) rotateY(0deg)`;
    document.querySelector('html').style.overflow = 'hidden';

    item.workPreview = true;
  }

  closePreview(item: Item, el?: HTMLElement, i?: number) {
    isNull(el) ? el = document.querySelectorAll('.work__items__list__item')[i] as HTMLElement : null;

    this.resetTransform(el);
    this.previewOverlay = false;
    setTimeout(() => {
      item.workPreview = false;
      document.querySelector('html').style.overflow = 'auto';
    }, 300);
  }

  // Resize update
  @HostListener('window:resize')
  bricksUpdate() { this.bricks.resize(); }

  ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
  }
}

import {
  Component,
  ChangeDetectorRef,
  AfterContentChecked,
  HostListener,
  Input,
  AfterViewInit,
} from '@angular/core';
import { Item } from '../../models/item';
import { Filter } from '../../models/filter';
import Bricks, { BricksInstance } from 'bricks.js';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkService } from 'src/app/services/work.service';
import { FiltersService } from 'src/app/services/filters.service';
import { isUndefined } from 'util';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements AfterViewInit, AfterContentChecked {
  @Input() projectFilter: Filter;

  // filters
  activeFilters: Filter[] = [];
  filters: Filter[] = [];

  // items
  items: Item[];

  // page/url
  pageType: string;
  projectTitle: string;

  // masonry
  bricks: BricksInstance;
  loadedImages = 0;
  masonryLoaded = false;
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
      this.toggleFilter(this.projectFilter) :
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
      this.items = data;
      this.loadMasonry();
    });
  }

  // set-up
  async getItems(): Promise<Item[]> {
    return await new Promise((resolve) => {
      this.workService.getWorkList()
        .then(data => resolve(data));
      });
  }

  setPageType() {
    this.activeRouter.url.subscribe(params => {
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
    this.loadedImages = 0;
    this.items.forEach(item => item.imageLoaded = false);
    console.log('pack');


    // setTimeout(() => {
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
    this.masonryLoaded = true;
    // }, 400);
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
    item.imageLoaded = true;

    if (this.loadedImages >= this.items.length - 1) { this.loadMasonry(); }
  }

  // Hover animations
  hoverAnimation(e: MouseEvent) {
    const target: HTMLElement = e.currentTarget as HTMLElement;

    const sensitivity = 0.1;
    const x = (e.offsetX - target.offsetWidth / 2) * sensitivity;
    const y = (e.offsetY - target.offsetHeight / 2) * sensitivity;

    target.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(1.05) rotateX(${-y * 0.75}deg) rotateY(${x * 0.75}deg)`;
  }

  hoverLeave(e: MouseEvent) {
    const target: HTMLElement = e.currentTarget as HTMLElement;
    target.style.transform = 'translate3d(0px, 0px, 0px) scale(1) rotateX(0deg) rotateY(0deg)';
  }

  // Resize update
  @HostListener('window:resize')
  bricksUpdate() { this.bricks.resize(); }
}

// tslint:disable-next-line: max-line-length
import {
  Component,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  AfterContentChecked,
  HostListener,
  Input,
  AfterViewInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Item } from '../../models/item';
import { Filter } from '../../models/filter';
import Bricks, { BricksInstance } from 'bricks.js';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkService } from 'src/app/services/work.service';
import { FiltersService } from 'src/app/services/filters.service';
import { FilterClass } from './filterClass';
import { Observable, BehaviorSubject, empty } from 'rxjs';
import { isUndefined } from 'util';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements AfterViewInit, AfterContentChecked {
  @Input() projectFilter: Filter;

  // filters
  filterClass: FilterClass;

  // items
  items: Item[];
  showItems: Item[];

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
    this.filterClass = new FilterClass(this);
    this.setPageType();
    this.getItems().then(items => {
      this.items = items;
      if (this.pageType === 'work') {
        this.filterClass.toggleFilter(this.projectFilter);
        this.filterClass.setFilteredItems(this.projectTitle);
      } else {
        this.filterClass.setFilteredItems();
        this.filtersService.getFilters().then(filters => this.filterClass.filters = filters);
      }
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
    setTimeout(() => {
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
    }, 400);
  }

  // metadata per item
  getMetadataValue(item: Item['metadata'], title: string) {
    return item.find(data => data.type === title).values;
  }

  showMetadata(item: Item, type: string): any {
    const values: any = item.metadata.filter(data => data.type === type);

    // if array, return string with spaces. Else return initial string
    return values[0].value instanceof Array ? ((values[0].value) as Array<string>).join(', ') : values[0].value;
  }

  // Other
  projectDetailRoute(e: string, projectFilter: Filter) {
    this.projectTitle = decodeURI(e).substr(1);

    if (projectFilter === this.projectFilter) {
      this.filterClass.setFilteredItems(this.projectTitle);
    } else {
      if (!isUndefined(this.projectFilter)) {
        this.filterClass.toggleFilter(this.projectFilter);
        this.filterClass.toggleFilter(projectFilter);
        this.projectFilter = projectFilter;
        this.filterClass.setFilteredItems(this.projectTitle);
      }
    }
  }

  routeToPost(title: string) {
    this.router.navigate([this.pageType === 'cms' ? 'cms/' + title
    : title]);
  }

  imageLoaded() {
    this.loadedImages++;

    if (this.loadedImages >= this.showItems.length - 1) { this.loadMasonry(); }
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

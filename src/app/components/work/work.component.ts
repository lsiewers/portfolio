// tslint:disable-next-line: max-line-length
import {
  Component,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  AfterContentChecked,
  HostListener,
  Input,
  AfterViewInit
} from '@angular/core';
import { Item } from '../../models/item';
import { Filter } from '../../models/filter';
import Bricks, { BricksInstance } from 'bricks.js';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WorkService } from 'src/app/services/work.service';
import { FiltersService } from 'src/app/services/filters.service';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements AfterViewInit, AfterContentChecked {
  @ViewChild('container', {static: false}) masonryContainer?: ElementRef<HTMLElement>;
  @Input() set filter(val) { this.filterSubject.next(val); }
  get filter() { return this.filterSubject.getValue(); }
  filters: Filter[] = [];
  activeFilters: Filter[] = [];
  filterSubject = new BehaviorSubject<{title?: string, type?: string}>({});

  items: Item[];
  showItems: Item[];
  page: string;

  bricks: BricksInstance;
  loadedImages = 0;
  // filters: Filter[] = [];
  masonryLoaded = false;
  showAmount = 3;
  suggested = false;


  constructor(
    private changeDetector: ChangeDetectorRef,
    private workService: WorkService,
    private filtersService: FiltersService,
    private router: Router
  ) {
   }

  ngAfterContentChecked() { this.changeDetector.detectChanges(); }

  ngAfterViewInit(): void {
    this.workService.getWorkList()
      .then(data => this.items = data)
      .finally(() => setTimeout(() => this.updateFilter(), 500));

    this.page = this.router.url === '/' ? 'home' : 'work-detail';
    this.filtersService.getFilters().then(filters => {
      console.log(filters);

      this.filters = filters;
    });
  }

  masonryInit() {
    // console.log(this.masonryContainer);

    this.bricks = Bricks({
      container: typeof this.masonryContainer !== 'undefined' ? this.masonryContainer.nativeElement : '.work__items__list',
      packed: 'packed',
      sizes: [
        { mq: '820px', columns: 2, gutter: 36 },
        { mq: '900px', columns: 2, gutter: 60 },
        { mq: '1280px', columns: 3, gutter: 36 },
        { mq: '1400px', columns: 3, gutter: 60 }
      ]
    });
  }

  loadMasonry() {
    this.masonryInit();
    setTimeout(() => {
      this.bricks.pack();
      this.masonryLoaded = true;
    }, 400);
  }

  showMetadata(item: Item, type: string): any {
    const values: any = item.metadata.filter(data => data.type === type);

    // if array, return string with spaces. Else return initial string
    return values[0].value instanceof Array ? ((values[0].value) as Array<string>).join(', ') : values[0].value;
  }

  toggleFilterTab(filter: Filter) {
    const activatedTabs = [];
    // console.log(filter);
    if (!filter.openTab) {
      let delay;
      this.filters.find(f => f.openTab === true) ? delay = true : delay = false;
      this.filters.forEach(f => {
        if (f.openTab === undefined) { f.openTab = false; }
        if (f !== filter) { f.openTab ? f.openTab = false : null }
        else if (delay) { setTimeout(() => f.openTab = true, 480); }
        else { f.openTab = true; }

        activatedTabs.push(f.openTab);
      });
    } else { filter.openTab = false; }
  }

  valuesCategorized(valuesList: Array<any>): boolean {
    return !!(valuesList[0] instanceof Object);
  }

  toggleFilter(filterType: string, value: string) {
    const filteredType = this.activeFilters.find(activeFilter => activeFilter.type === filterType);

    // if type is already filtered
    if (this.activeFilters.length === 0 || typeof filteredType === 'undefined') {
      this.activeFilters.push({type: filterType, values: [value]});
    } else {
      // if specific value is already filtered
      if (filteredType.values.includes(value)) {
        // remove filtered item
        filteredType.values.splice(filteredType.values.indexOf(value), 1);

        // remove object from active filters if empty
        !filteredType.values.length ? this.activeFilters.splice(this.activeFilters.indexOf(filteredType), 1) : null;
      } else {
        // add filtered item
        filteredType.values.push(value);
      }
    }

    this.updateFilter();
  }

  updateFilter() {
    this.masonryLoaded = false;
    this.showItems = [];
    let itemsProcessed = 0;

    // reset values
    this.items.forEach(item => item.filterComplete = []);

    // go through items if filters are active
    if (this.activeFilters.length > 0) {
      // for each active filter
      this.activeFilters.forEach(filteredType => {
        // for each work item from items.json (> database request)
        this.items.forEach(item => {
          itemsProcessed++; // counter to check if each item is processed

          // if detail page is equal to this item
          if (item.title === this.filter.title) { return item.filterComplete.push(false); }

          // get item metadata equal to filter type (e.a. 'focus')
          const typeMatch = item.metadata.find(data => data.type === filteredType.type);

          // for each value in filter type (e.a. 'User Experience')
          filteredType.values.forEach(value => {
            // if item.filterComplete doesn't exist jet, create it
            if (item.filterComplete === undefined) { item.filterComplete = []; }

            // if typeMatch.value (item metadata value) equals filter, set to true!
            // if metadata contains multiple values, check if value is inside array
            if (
              typeMatch.value instanceof Array && typeMatch.value.includes(value) ||
              typeMatch.value === value
            ) {
              item.filterComplete.push(true);
            } else { item.filterComplete.push(false); } // else set to false!
            // console.log(!item.filterComplete.includes(false), item.filterComplete);
          });

          // if all items are processed, show!
          if (itemsProcessed === this.items.length) {
            // console.log('Completed', this.activeFilters, this.showItems, this.items.map(i => i.filterComplete));
            this.loadMasonry();
          }
        });
      });

      // re iterate through items for check
      this.items.forEach(item => {

        // if item includes doesn't include a false match with filter
        if (!item.filterComplete.includes(false)) {
          // and amount of items is lower than maximum to show
          if (this.showItems.length < this.showAmount) { this.showItems.push(item); } // add item!
        }
      });

    } else {
      this.items.forEach(item => this.showItems.length < this.showAmount ? this.showItems.push(item) : null);
    }

  }

  findActiveFilter(type: string, value: string) {
    const filteredType = this.activeFilters.find(activeFilter => activeFilter.type === type);
    return typeof filteredType === 'undefined' ? false : filteredType.values.includes(value);
  }

  routeToPost(title) { this.router.navigate([encodeURI(title)]); }

  imageLoaded() {
    this.loadedImages++;
    if (this.loadedImages === this.showItems.length) { this.loadMasonry(); }
  }

  // animation of hover on work item
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

  @HostListener('window:resize')
  bricksUpdate() { this.bricks.resize(); }
}

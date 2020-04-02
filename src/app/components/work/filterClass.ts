import { Filter } from 'src/app/models/filter';
import { Item } from 'src/app/models/item';
import { WorkComponent } from './work.component';
import { isUndefined } from 'util';

export class FilterClass {
  filters: Filter[] = [];
  activeFilters: Filter[] = [];
  projectFocus: Filter;
  workComponent: WorkComponent;

  constructor(workComponent?) {
    this.workComponent = workComponent;
  }

  findActiveFilter(type: string, value: string) {
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

  // change active filters by adding or remove specified
  toggleFilter(filter: Filter) {
    const value = filter.values[0];
    const filteredType = this.activeFilters.find(activeFilter => activeFilter.type === filter.type);

    // if type is already filtered
    if (this.activeFilters.length === 0 || typeof filteredType === 'undefined') {
      this.activeFilters.push({type: filter.type, values: [value]});
    } else {
      // if specific value is already filtered
      if (filteredType.values.includes(value)) {
        // remove filtered item
        filteredType.values.splice(filteredType.values.indexOf(value), 1);

        // remove object from active filters if empty
        if (!filteredType.values.length) { this.activeFilters.splice(this.activeFilters.indexOf(filteredType), 1); }
      } else {
        // add filtered item
        filteredType.values.push(value);
      }
    }

    this.setFilteredItems();
  }

  // update filters and view
  getFilteredItems(items: Item[], showAmount: number, projectTitle?) {
    let itemsProcessed = 0;
    const filteredItems = [];

    // reset values
    items.forEach(item => item.filterComplete = []);

    // go through items if filters are active
    if (this.activeFilters.length > 0) {

      // for each active filter
      this.activeFilters.forEach(filteredType => {
        // for each work item from items.json (> database request)
        items.forEach(item => {
          // if detail page is equal to this item
          if (item.title === projectTitle) {
            item.filterComplete.push(false);
          }

          // get item metadata equal to filter type (e.a. 'focus')
          const typeMatch = item.metadata.find(data => data.type === filteredType.type);

          // for each value in filter type (e.a. 'User Experience')
          filteredType.values.forEach(value => {

            // if item.filterComplete doesn't exist jet, create it
            if (item.filterComplete === undefined) { item.filterComplete = []; }

            // if typeMatch.value (item metadata value) equals filter, set to true!
            // if metadata contains multiple values, check if value is inside array
            if (
              typeMatch.values instanceof Array && typeMatch.values.includes(value) ||
              typeMatch.values === value
            ) {
              item.filterComplete.push(true);
            } else { item.filterComplete.push(false); } // else set to false!
          });
          itemsProcessed++; // counter to check if each item is processed
        });
      });

      // re iterate through items for check
      items.forEach(item => {

        // if item doesn't include a false match with filter
        if (!!!item.filterComplete.includes(false)) {
          // and amount of items is lower than maximum to show
          if (filteredItems.length < showAmount) { filteredItems.push(item); } // add item!
        }
      });
    } else {
      // if shown items amount is lower than it may be, add!
      items.forEach(item => filteredItems.length < showAmount ? filteredItems.push(item) : null);
    }

    return filteredItems;
  }

  setFilteredItems(projectTitle?: string) {
    this.workComponent.showItems = this.getFilteredItems(
      this.workComponent.items,
      this.workComponent.showAmount,
      !isUndefined(projectTitle) && projectTitle === 'work' ?
        projectTitle : null
    );
  }
}

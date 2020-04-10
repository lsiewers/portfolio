import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Filter } from '../models/filter';
import { WorkService } from './work.service';
import { Item } from '../models/item';
import { resolve } from 'path';
import { isArray } from 'util';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

constructor(
  private db: AngularFirestore,
  private workService: WorkService
) { }

  getFilters() {
    return new Promise<any>((resolve) => {
      this.db.collection('/filters').valueChanges()
        .subscribe(snapshots => resolve(snapshots));
    });
  }

  // change active filters by adding or remove specified
  toggleFilter(filter: Filter, activeFilters: Filter[]): Filter[] {
    const value = filter.values[0];
    const filteredType = activeFilters.find(activeFilter => activeFilter.type === filter.type);

    // if type is already filtered
    if (activeFilters.length === 0 || typeof filteredType === 'undefined') {
      activeFilters.push({type: filter.type, values: [value]});
    } else {
      // if specific value is already filtered
      if (filteredType.values.includes(value)) {
        // remove filtered item
        filteredType.values.splice(filteredType.values.indexOf(value), 1);

        // remove object from active filters if empty
        if (!filteredType.values.length) { activeFilters.splice(activeFilters.indexOf(filteredType), 1); }
      } else {
        // add filtered item
        filteredType.values.push(value);
      }
    }

    return activeFilters;
  }

  getFilteredItems(activeFilters: Filter[]): Promise<any> {
    return new Promise<any>((resolve) => {
      this.workService.getWorkList().then((items: Item[]) => {
        // console.log(items, activeFilters);
        activeFilters.forEach((filterType: Filter) => {
          filterType.values.forEach(value =>
            items = items.filter(item =>
              isArray(item.metadata[filterType.type]) ?
                item.metadata[filterType.type].includes(value) :
                item.metadata[filterType.type] === value
            )
          );
        });

        resolve(items);
      });
    });
  }
}

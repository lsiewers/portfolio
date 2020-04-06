import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Filter } from '../models/filter';
import { WorkService } from './work.service';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

constructor(
  private db: AngularFirestore,
  private workService: WorkService
) { }

  getFilters() {
    return new Promise<any>((resolve, reject) => {
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

  getFilteredItems(activeFilters: Filter[], showAmount?: number): Promise<Item[]> {
    return this.workService.getWorkQuery(activeFilters, showAmount);
  }
}

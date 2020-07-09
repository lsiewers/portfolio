import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Filter } from '../models/filter';
import { WorkService } from './work.service';
import { Item } from '../models/item';
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
      activeFilters.push({type: filter.type, values: [value as string]});
    } else {
      // if specific value is already filtered
      if ((filteredType.values as string[]).includes(value as string)) {
        // remove filtered item
        filteredType.values.splice((filteredType.values as string[]).indexOf(value as string), 1);

        // remove object from active filters if empty
        if (!filteredType.values.length) { activeFilters.splice(activeFilters.indexOf(filteredType), 1); }
      } else {
        // add filtered item
        // if filter, than replace value
        if (filter.type === 'focus') {
          (filteredType.values as string[]) = [(value as string)];
        } else {
          (filteredType.values as string[]).push(value as string);
        }
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
              Array.isArray(item.metadata[filterType.type]) ?
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

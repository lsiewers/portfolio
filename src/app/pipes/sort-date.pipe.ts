import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../models/item';

@Pipe({
  name: 'sortDate'
})
export class SortDatePipe implements PipeTransform {

  transform(items: Item[], args?: any): any {
    items.sort((a, b) => {
      return b.metadata.finishDate.getTime() - a.metadata.finishDate.getTime();
    });
  }

}

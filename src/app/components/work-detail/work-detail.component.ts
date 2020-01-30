import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from '../../models/item';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-work-detail',
  templateUrl: './work-detail.component.html',
  styleUrls: ['./work-detail.component.scss']
})
export class WorkDetailComponent implements OnInit {
  data: Item;
  workFilter: {type: string, title: string};
  pmi = [
    {
      title: 'like or see working',
      fields: ['']
    },
    {
      title: 'dislike or don\'t see working',
      fields: ['']
    },
    {
      title: 'find interesting',
      fields: ['']
    }
  ];
  items: Observable<any[]>;

  constructor(
    private activeRouter: ActivatedRoute,
    private db: AngularFirestore
  ) {
    this.getItemData();
  }

  ngOnInit() {
  }

  getItemData() {
    let urlParam;
    this.activeRouter.params.subscribe(data => urlParam = decodeURI(data.id));

    this.db.collection<Item>('posts').valueChanges().subscribe(items => {
      this.data = items.find(item => item.title === urlParam);
    });
  }

  addField(fields: any, e: Event) {
    // if length of string is at least 4 chars
    if (fields[fields.length - 1].length > 4) {
      fields.push('');

      setTimeout(() => {
        const lastInput: HTMLInputElement = ((e.target as HTMLElement)
          .parentElement
          .parentElement
          .lastElementChild
          .previousElementSibling
          .firstElementChild as HTMLInputElement);

        // lastInput.value = '';
        lastInput.value = '';
        lastInput.focus();
      }, 150);
    }
  }

  removeField(topicIndex: number, fieldIndex: number, e: Event) {
    const target: HTMLInputElement = e.target as HTMLInputElement;
    const fields = this.pmi[topicIndex].fields;

    if (
      fields.length > 1 &&
      target.value.length === 0
    ) {
      fields.pop();

      if (fieldIndex === 0) { target.focus();
      } else  { target.parentElement.previousElementSibling.querySelector(`input`).focus(); }
    } else {
      target.focus();
    }
  }

  isArray(value: any) {
    return typeof value === 'string';
  }
}

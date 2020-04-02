import { Component, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';
import { Item } from '../../models/item';
import { Observable } from 'rxjs';
import { WorkService } from 'src/app/services/work.service';
import { WorkComponent } from '../work/work.component';
import { isUndefined, isArray } from 'util';
import { Filter } from 'src/app/models/filter';

@Component({
  selector: 'app-work-detail',
  templateUrl: './work-detail.component.html',
  styleUrls: ['./work-detail.component.scss']
})
export class WorkDetailComponent implements AfterViewInit {
  data: Item;
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
  blur = 0;
  opacity = 1;
  currentPage: string;
  projectFilter: Observable<Filter>;

  constructor(
    private activeRouter: ActivatedRoute,
    private workService: WorkService,
    private router: Router,
  ) {
    this.router.events.subscribe((e: RouterEvent) => {
      if (!isUndefined(e.url)) {
        if (this.currentPage !== e.url || isUndefined(this.currentPage)) {
          this.currentPage = e.url;
          this.onRoute();
        }
      }
    });
  }

  ngAfterViewInit(): void  {
  }

  onRoute() {
    this.activeRouter.params.subscribe(data => {
      this.workService.getWorkPost(decodeURI(data.id))
        .then(post => {
          this.data = post;
          this.projectFilter = new Observable<Filter>((observer) => {
            observer.next(post.metadata.find(subdata => subdata.type === 'focus'));
          });
        });
    });
  }

  isArray(obj) { return isArray(obj); }

  // PMI
  //
  //
  // addField(fields: any, e: Event) {
  //   // if length of string is at least 4 chars
  //   if (fields[fields.length - 1].length > 4) {
  //     fields.push('');

  //     setTimeout(() => {
  //       const lastInput: HTMLInputElement = ((e.target as HTMLElement)
  //         .parentElement
  //         .parentElement
  //         .lastElementChild
  //         .previousElementSibling
  //         .firstElementChild as HTMLInputElement);

  //       // lastInput.value = '';
  //       lastInput.value = '';
  //       lastInput.focus();
  //     }, 150);
  //   }
  // }

  // removeField(topicIndex: number, fieldIndex: number, e: Event) {
  //   const target: HTMLInputElement = e.target as HTMLInputElement;
  //   const fields = this.pmi[topicIndex].fields;

  //   if (
  //     fields.length > 1 &&
  //     target.value.length === 0
  //   ) {
  //     fields.pop();

  //     if (fieldIndex === 0) { target.focus();
  //     } else  { target.parentElement.previousElementSibling.querySelector(`input`).focus(); }
  //   } else {
  //     target.focus();
  //   }
  // }

  // @HostListener('document:scroll', ['$event'])
  // parallaxBlur() {
  //   const scrollTop = this.document.documentElement.scrollTop;
  //   if (scrollTop < this.screenHeight * 0.8) {
  //     const blurSensitivity = 0.015;

  //     this.blur = (this.screenHeight - (this.screenHeight - scrollTop)) * blurSensitivity;

  //   }
  // }
}

import { Component, Inject, ViewChild, AfterViewInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';
import { Item } from '../../models/item';
import { Observable, Subscription } from 'rxjs';
import { WorkService } from 'src/app/services/work.service';
import { isUndefined, isArray } from 'util';
import { Filter } from 'src/app/models/filter';
import { WorkComponent } from '../work/work.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-work-detail',
  templateUrl: './work-detail.component.html',
  styleUrls: ['./work-detail.component.scss']
})
export class WorkDetailComponent implements OnDestroy {
  @ViewChild('workComponent', {static: false}) workComponent: WorkComponent;
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
  projectFilter: Filter;
  _routerSubscription: Subscription;

  constructor(
    private titleService: Title,
    private meta: Meta,
    private workService: WorkService,
    private router: Router,
  ) {
    this._routerSubscription = this.router.events.subscribe((e: RouterEvent) => {
      if (!isUndefined(e.url)) {
        if (this.currentPage !== e.url || isUndefined(this.currentPage)) {
          this.currentPage = e.url;
          this.onRoute(e.url);
          return isUndefined(this.workComponent) ?
            null : this.workComponent.projectDetailRoute(e.url, this.projectFilter);
        }
      }
    });
  }

  updateMetadata() {
    const projectName = decodeURI(this.currentPage).substr(1);
    this.titleService.setTitle(projectName + ' by Luuk Siewers');
    this.meta.updateTag({ name: 'title', content: projectName + ' by Luuk Siewers' });
    this.meta.updateTag({ property: 'og:title', content: projectName + ' by Luuk Siewers'});
    this.meta.updateTag({ name: 'twitter:title', content: projectName + ' by Luuk Siewers'});

    this.meta.updateTag({ name: 'description', content: this.data.subtitle });
    this.meta.updateTag({ property: 'og:description', content: this.data.subtitle });
    this.meta.updateTag({ property: 'twitter:description', content: this.data.subtitle });

    this.meta.updateTag({ property: 'og:url', content: 'https://luuksiewers.nl' + this.currentPage });
    this.meta.updateTag({ property: 'twitter:url', content: 'https://luuksiewers.nl' + this.currentPage });

    this.meta.updateTag({ property: 'og:image', content: this.data.media.imageUrl });
    this.meta.updateTag({ property: 'twitter:image', content: this.data.media.imageUrl });
  }

  onRoute(param) {
    const projectTitle = decodeURI(param).substr(1);
    this.workService.getWorkPost(projectTitle)
      .then(post => {
        this.data = post;
        if (!isUndefined(post)) { this.updateMetadata(); }
        return projectTitle !== '' ?
          this.projectFilter = post.metadata.find(subdata => subdata.type === 'focus')
          : null;
      });
  }

  isArray(obj) { return isArray(obj); }

  ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
  }

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

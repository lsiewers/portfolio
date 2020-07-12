import { Component, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from '../../models/item';
import { Observable, Subscription } from 'rxjs';
import { WorkService } from 'src/app/services/work.service';
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
  items: Observable<any[]>;
  blur = 0;
  opacity = 1;
  currentPage: string;
  projectFilter: Filter;
  readMore = false;
  animateHeaderIn = false;
  // tslint:disable-next-line: variable-name
  _routerSubscription: Subscription;

  constructor(
    private titleService: Title,
    private meta: Meta,
    private workService: WorkService,
    private activeRouter: ActivatedRoute,
  ) {
    this._routerSubscription =
      this.activeRouter.params.subscribe(data => {
        if (typeof data.id !== 'undefined') {
          if (this.currentPage !== data.id || typeof this.currentPage === 'undefined') {
            this.currentPage = data.id;
            this.onRoute(data.id);
            // return typeof this.workComponent === 'undefined' ?
              // null : this.workComponent.projectDetailRoute(data.id, this.projectFilter);
          }
        }
      });
  }

  updateMetadata() {
    const projectName = this.data.title;
    this.titleService.setTitle(projectName + ' by Luuk Siewers');
    this.meta.updateTag({ name: 'title', content: projectName + ' by Luuk Siewers' });
    this.meta.updateTag({ property: 'og:title', content: projectName + ' by Luuk Siewers'});
    this.meta.updateTag({ name: 'twitter:title', content: projectName + ' by Luuk Siewers'});

    this.meta.updateTag({ name: 'description', content: this.data.subtitle });
    this.meta.updateTag({ property: 'og:description', content: this.data.subtitle });
    this.meta.updateTag({ property: 'twitter:description', content: this.data.subtitle });

    this.meta.updateTag({ property: 'og:url', content: 'https://luuksiewers.nl' + this.currentPage });
    this.meta.updateTag({ property: 'twitter:url', content: 'https://luuksiewers.nl' + this.currentPage });

    this.meta.updateTag({ property: 'og:image', content: this.data.header.url });
    this.meta.updateTag({ property: 'twitter:image', content: this.data.header.url });
  }

  onRoute(param: string) {
    this.animateHeaderIn = false;
    this.workService.getWorkPost(param)
      .then(post => {
        this.data = post;
        this.readMore = false;
        this.animateHeaderIn = true;
        if (post !== undefined) { this.updateMetadata(); }
        return param !== '' ?
          this.projectFilter = {
            type: Object.keys(post.metadata.focus)[0],
            values: [post.metadata.focus[0]]
          } : null;
      });
  }

  metadataIsEmpty(metadata: any): boolean {
    if (this.isArray(metadata)) {
      return metadata === this.data.metadata.collaboration || metadata === this.data.metadata.links ?
        metadata[0].name.length > 0 : metadata[0].length > 0;
    } else { return metadata.length > 0; }
  }

  isArray(obj) { return Array.isArray(obj); }

  ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
  }

}

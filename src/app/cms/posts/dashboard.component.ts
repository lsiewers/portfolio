import { Component, OnInit, ChangeDetectorRef, AfterContentChecked, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Item } from 'src/app/models/item';
import { WorkService } from 'src/app/services/work.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterContentChecked, OnDestroy {
  posts: Item[];
  newPost: Item;
  _getWorkListSubscriber: Subscription;

  constructor(
    private db: AngularFirestore,
    private workService: WorkService,
    private changeDetector: ChangeDetectorRef,
    private router: Router
  ) {
    this.getWorkList();

    this.newPost = {
      title: 'New Post',
      subtitle: 'A post about...',
      id: null,
      header: {
        pos: 'center',
        ref: '',
        type: 'image',
        transparentImage: false,
        url: null
      },
      details: [
        {
          class: 'image--right',
          text: 'Blah die blah die blah',
          title: 'My role or final product',
          links: [{name: 'a link', icon: '', url: ''}],
          media: {
            ref: '',
            type: 'image',
            url: null
          }
        }
      ],
      metadata: {
        focus: ['Experience | Interface | Visual | Experimental'],
        purpose: 'Study | Side job | Internship',
        tools: [''],
        budget: '< 1 week | 1 - 3 weeks | > 3 weeks',
        client: [''],
        collaboration: [{name: '', url: ''}],
        finishDate: new Date(new Date().getTime()),
        links: [{
          name: 'code',
          icon: 'github',
          url: 'github.com/lsiewers'
        }]
      },
      filterComplete: null,
      productDescription: '',
      palette: {
        primary: '#000',
        secondary: '#fff',
        tertiary: '#fefefe',
      }
    };
  }

  ngAfterContentChecked() { this.changeDetector.detectChanges(); }

  ngOnInit() {
  }

  getWorkList() {
    this._getWorkListSubscriber = this.db.collection<Item>('posts').valueChanges().subscribe(posts => this.posts = posts);
  }

  addProject() {
    this.workService.createWorkPost(this.newPost).then(data => {
      this.newPost.id = data.id;
      this.workService.updateWorkPost(this.newPost);
    }).finally(() => {
      this.router.navigate(['cms', this.newPost.title.toLowerCase().split(' ').join('-')]);
    });
  }

  ngOnDestroy(): void {
    this._getWorkListSubscriber.unsubscribe();
  }
}

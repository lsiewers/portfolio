import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Item } from 'src/app/models/item';
import { WorkService } from 'src/app/services/work.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterContentChecked {
  posts: Item[];
  newPost: Item;

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
        url: null
      },
      details: '<p></p>',
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
          icon: 'github.svg',
          url: 'github.com/lsiewers'
        }]
      },
      filterComplete: null
    };
  }

  ngAfterContentChecked() { this.changeDetector.detectChanges(); }

  ngOnInit() {
  }

  getWorkList() {
    this.db.collection<Item>('posts').valueChanges().subscribe(posts => this.posts = posts);
  }

  addProject() {
    this.workService.createWorkPost(this.newPost).then(data => {
      this.newPost.id = data.id;
      this.workService.updateWorkPost(this.newPost);
    }).finally(() => {
      this.router.navigate(['cms', this.newPost.title.toLowerCase().split(' ').join('-')]);
    });
  }
}

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
      media: {
        imagePos: 'center',
        imageUrl: '',
        imageRef: '',
        videoUrl: ''
      },
      details: null,
      metadata: {
        focus: [''],
        purpose: '',
        tools: [''],
        budget: '',
        client: [''],
        collaboration: [{name: '', url: ''}],
        finishDate: new Date('Wed Mar 25 2015 01:00:00 GMT+0100 (Central European Standard Time)')
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
      this.router.navigate(['cms', encodeURI(this.newPost.title)]);
    });
  }
}

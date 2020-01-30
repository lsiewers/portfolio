import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  posts: Item[];

  constructor(
    private db: AngularFirestore
  ) {
      this.db.collection<Item>('posts').valueChanges().subscribe(posts => {
        this.posts = posts;
      });
  }

  ngOnInit() {
  }

  encodeURI(title: string) {
    return encodeURI(title);
  }
}

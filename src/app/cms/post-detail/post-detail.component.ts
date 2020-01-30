import { Component, OnInit } from '@angular/core';
import { Item } from 'src/app/models/item';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  data: Item;

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

}

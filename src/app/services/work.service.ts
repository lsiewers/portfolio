import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class WorkService {

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  getWorkList(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.db.collection('/posts').valueChanges()
        .subscribe(snapshot => resolve(snapshot));
    });
  }

  getWorkPost(urlParam: string): Promise<Item> {
    return new Promise<Item>((resolve, reject) => {
      this.db.collection<Item>('posts')
      .valueChanges()
      .subscribe(items => resolve(items.find(item => item.title.toLowerCase().split(' ').join('-') === urlParam)));
    });
  }

  updateWorkPost(data: Item): Promise<void> {
    return this.db.collection<Item>('posts').doc(data.id).set(data);
  }

  removeWorkPost(id: string): Promise<void> {
    return this.db.collection<Item>('posts').doc(id).delete();
  }

  createWorkPost(data: Item): Promise<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>> {
    return this.db.collection<Item>('posts').add(data);
  }

  async getWorkMedia(url: string): Promise<any> {
    // return this.storage.ref(url).getDownloadURL().toPromise();
    return await this.storage.storage.refFromURL(url).getDownloadURL();
  }

  getMediaFolder(id: string) {
    return this.storage.storage.ref(`posts/${id}`);
  }
}

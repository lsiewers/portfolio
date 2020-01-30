import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Item } from '../models/item';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkService {

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  getWorkList(): Promise<Item[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.db.collection('/posts').valueChanges()
        .subscribe(snapshot => resolve(snapshot));
    });
  }

  async getWorkMedia(url: string): Promise<any> {
    // return this.storage.ref(url).getDownloadURL().toPromise();
    return await this.storage.storage.refFromURL(url).getDownloadURL();
  }
}

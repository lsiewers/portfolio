import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) { }

  getPageList(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      this.db.collection('/pages').valueChanges()
        .subscribe(snapshot => resolve(snapshot));
    });
  }

  getPage(urlParam: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection<any>('pages')
      .valueChanges()
      .subscribe(items => resolve(items.find(item => item.url.toLowerCase().split(' ').join('-') === urlParam)));
    });
  }

  updatePage(data): Promise<void> {
    return this.db.collection<any>('pages').doc(data.id).set(data);
  }

  async getWorkMedia(url: string): Promise<any> {
    // return this.storage.ref(url).getDownloadURL().toPromise();
    return await this.storage.storage.refFromURL(url).getDownloadURL();
  }

  getMediaFolder(id: string) {
    return this.storage.storage.ref(`pages/${id}`);
  }
}

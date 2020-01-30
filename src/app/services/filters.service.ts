import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

constructor(private db: AngularFirestore) { }


  getFilters() {
    return new Promise<any>((resolve, reject) => {
      this.db.collection('/filters').valueChanges()
        .subscribe(snapshots => resolve(snapshots));
    });
  }
}

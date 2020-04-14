import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from 'angularfire2';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SafePipe } from './pipes/safe.pipe';
import { WorkComponent } from './components/work/work.component';
import { environment } from 'src/environments/environment';
import { WorkDetailComponent } from './components/work-detail/work-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ClickOutsideModule } from 'ng-click-outside';
import { DashboardComponent } from './cms/posts/dashboard.component';
import { PostDetailComponent } from './cms/post-detail/post-detail.component';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MoreInfoComponent } from './components/more-info/more-info.component';
import { SortDatePipe } from './pipes/sort-date.pipe';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      SafePipe,
      WorkComponent,
      WorkDetailComponent,
      DashboardComponent,
      PostDetailComponent,
      MoreInfoComponent,
      SortDatePipe
   ],
   imports: [
      CommonModule,
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      ClickOutsideModule,
      FormsModule,
      InlineSVGModule.forRoot({ baseUrl: '/assets/icons/' }),
      AngularEditorModule,
      AngularFireStorageModule,
      AngularFireModule.initializeApp(environment.firebase),
      AngularFirestoreModule.enablePersistence(), // imports firebase/firestore, only needed for database feature
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }

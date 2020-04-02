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
import { ContactComponent } from './components/contact/contact.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ClickOutsideModule } from 'ng-click-outside';
import { DashboardComponent } from './cms/posts/dashboard.component';
import { PostDetailComponent } from './cms/post-detail/post-detail.component';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      SafePipe,
      WorkComponent,
      WorkDetailComponent,
      ContactComponent,
      DashboardComponent,
      PostDetailComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      ClickOutsideModule,
      FormsModule,
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

import { environment } from 'src/environments/environment';

// components
import { AppComponent } from './app.component';
import { DashboardComponent } from './cms/posts/dashboard.component';
import { PostDetailComponent } from './cms/post-detail/post-detail.component';
import { WorkDetailComponent } from './components/work-detail/work-detail.component';
import { HomeComponent } from './components/home/home.component';
import { WorkComponent } from './components/work/work.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AboutMeComponent } from './components/about-me/about-me.component';
const components = [
  DashboardComponent,
  PostDetailComponent,
  WorkDetailComponent,
  AppComponent,
  HomeComponent,
  WorkComponent,
  NavigationComponent,
  AboutMeComponent
];

// modules
import { AngularFireStorageModule } from '@angular/fire/storage';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ClickOutsideModule } from 'ng-click-outside';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AppRoutingModule } from './app-routing.module';
import { DeviceDetectorModule } from 'ngx-device-detector';
const modules = [
  CommonModule,
  BrowserModule,
  AppRoutingModule,
  HttpClientModule,
  ClickOutsideModule,
  FormsModule,
  DeviceDetectorModule,
  AngularFireStorageModule,
  AngularFireModule.initializeApp(environment.firebase),
  AngularFirestoreModule.enablePersistence(), // imports firebase/firestore, only needed for database feature
]

// pipes
import { SortDatePipe } from './pipes/sort-date.pipe';
import { SafePipe } from './pipes/safe.pipe';
const pipes = [SortDatePipe, SafePipe];

@NgModule({
   declarations: [
      ...components,
      ...pipes
   ],
   imports: [
      ...modules
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }

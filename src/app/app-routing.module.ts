import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WorkDetailComponent } from './components/work-detail/work-detail.component';
import { DashboardComponent } from './cms/posts/dashboard.component';
import { PostDetailComponent } from './cms/post-detail/post-detail.component';
import { AboutMeComponent } from './components/about-me/about-me.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'cms',
    pathMatch: 'full',
    component: DashboardComponent
  },
  {
    path: 'about-me',
    pathMatch: 'full',
    component: AboutMeComponent
  },
  {
    path: 'cms/:id',
    component: PostDetailComponent
  },
  {
    path: ':id',
    component: WorkDetailComponent
  },
  { path: '**', component: HomeComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule],
})
export class AppRoutingModule { }

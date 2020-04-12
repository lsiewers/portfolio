import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WorkDetailComponent } from './components/work-detail/work-detail.component';
import { DashboardComponent } from './cms/posts/dashboard.component';
import { PostDetailComponent } from './cms/post-detail/post-detail.component';
import { MoreInfoComponent } from './components/more-info/more-info.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'about-me',
    pathMatch: 'full',
    component: MoreInfoComponent
  },
  {
    path: 'cms',
    pathMatch: 'full',
    component: DashboardComponent
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

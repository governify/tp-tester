import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import {MetricsTesterComponent} from "./pages/metrics-tester/metrics-tester.component";
import {TpaLoadedComponent} from "./pages/tpa-loaded/tpa-loaded.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'tpa-loaded',
    component: TpaLoadedComponent
  },
  {
    path: 'metrics-tester',
    component: MetricsTesterComponent
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

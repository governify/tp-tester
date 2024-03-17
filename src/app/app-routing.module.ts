import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MetricsTesterComponent } from "./pages/metrics-tester/metrics-tester.component";
import { MetricsLoaderComponent } from "./pages/metrics-loader/metrics-loader.component";
import { ExecutorComponent } from "./pages/metrics-loader/executor/executor.component";
import { ViewerComponent } from "./pages/metrics-loader/viewer/viewer.component";
import { TpaManagementComponent } from "./pages/tpa-management/tpa-management.component";
import{ TpaDeleteComponent } from "./pages/tpa-management/tpa-delete/tpa-delete.component";
import { TpaViewComponent } from "./pages/tpa-management/tpa-view/tpa-view.component";
import { TpaEditComponent } from "./pages/tpa-management/tpa-edit/tpa-edit.component";
import {SectionsComponent} from "./pages/tpa-management/tpa-edit/sections/sections.component";
import {AllComponent} from "./pages/tpa-management/tpa-edit/all/all.component";
import {GhSimulatorComponent} from "./pages/gh-simulator/gh-simulator.component";
import {RepositoryComponent} from "./pages/gh-simulator/repository/repository.component";
const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'tpa-management',
    component: TpaManagementComponent
  },
  {
    path: 'tpa-management/delete/:id',
    component: TpaDeleteComponent
  },
  {
    path: 'tpa-management/view/:id',
    component: TpaViewComponent
  },
  {
    path: 'tpa-management/edit/:id',
    component: TpaEditComponent
  },
  {
    path: 'tpa-management/edit/sections/:id',
    component: SectionsComponent
  },
  {
    path: 'tpa-management/edit/all/:id',
    component: AllComponent
  },
  {
    path: 'metrics-tester',
    component: MetricsTesterComponent
  },
  {
    path: 'metrics-loader',
    component: MetricsLoaderComponent
  },
  {
    path: 'metrics-loader/executor/:fileName',
    component: ExecutorComponent
  },
  {
    path: 'metrics-loader/viewer/:fileName',
    component: ViewerComponent
  },
  {
    path: 'gh-simulator',
    component: GhSimulatorComponent
  },
  {
    path: 'gh-simulator/repository/:repoName',
    component: RepositoryComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

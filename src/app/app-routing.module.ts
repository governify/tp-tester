import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MetricsTesterComponent} from "./pages/metrics-tester/metrics-tester.component";
import { TpaLoadedComponent} from "./pages/tpa-loaded/tpa-loaded.component";
import { MetricsLoaderComponent} from "./pages/metrics-loader/metrics-loader.component";
import { ExecutorComponent} from "./pages/metrics-loader/executor/executor.component";
import {ViewerComponent} from "./pages/metrics-loader/viewer/viewer.component";

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
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

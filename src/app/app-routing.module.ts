import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MetricsLoaderComponent } from "./pages/metrics-loader/metrics-loader.component";
import { ExecutorComponent } from "./pages/metrics-loader/executor/executor.component";
import { ViewerComponent } from "./pages/metrics-loader/viewer/viewer.component";
import { TpaManagementComponent } from "./pages/tpa-management/tpa-management.component";
import{ TpaDeleteComponent } from "./pages/tpa-management/tpa-delete/tpa-delete.component";
import { TpaViewComponent } from "./pages/tpa-management/tpa-view/tpa-view.component";
import { TpaEditComponent } from "./pages/tpa-management/tpa-edit/tpa-edit.component";
import {SectionsComponent} from "./pages/tpa-management/tpa-edit/sections/sections.component";
import {AllComponent} from "./pages/tpa-management/tpa-edit/all/all.component";
import {CloneComponent} from "./pages/gh-simulator/clone/clone.component";
import {RepositoryComponent} from "./pages/gh-simulator/clone/repository/repository.component";
import {GhSimulatorComponent} from "./pages/gh-simulator/gh-simulator.component";
import {LocalComponent} from "./pages/gh-simulator/local/local.component";
import {PullRequestComponent} from "./pages/gh-simulator/local/pull-request/pull-request.component";
import {BranchesComponent} from "./pages/gh-simulator/local/branches/branches.component";
import {ActionsComponent} from "./pages/gh-simulator/local/actions/actions.component";
import {ConfigComponent} from "./pages/config/config.component";
import {TpaExecutorComponent} from "./pages/metrics-loader/tpa-executor/tpa-executor.component";
import {TpaViewerComponent} from "./pages/metrics-loader/tpa-viewer/tpa-viewer.component";
import {TestsComponent} from "./pages/tests/tests.component";
import {YamlViewComponent} from "./pages/tests/yaml-view/yaml-view.component";
import {YamlEditComponent} from "./pages/tests/yaml-edit/yaml-edit.component";
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
    path: 'metrics-loader/tpa/executor/:tpa/:fileName',
    component: TpaExecutorComponent
  },
  {
    path: 'metrics-loader/tpa/viewer/:tpa/:fileName',
    component: TpaViewerComponent
  },
  {
    path: 'gh-simulator',
    component: GhSimulatorComponent
  },
  {
    path: 'gh-simulator/clone',
    component: CloneComponent
  },
  {
    path: 'gh-simulator/local',
    component: LocalComponent
  },
  {
    path: 'gh-simulator/local/branches/:repoName',
    component: BranchesComponent
  },
  {
    path: 'gh-simulator/local/pull-request/:repoName',
    component: PullRequestComponent
  },
  {
    path: 'gh-simulator/local/actions/:repoName',
    component: ActionsComponent
  },
  {
    path: 'gh-simulator/repository/:owner/:repoName',
    component: RepositoryComponent
  },
  {
    path: 'config',
    component: ConfigComponent
  },
  {
    path: 'tester',
    component: TestsComponent
  },
  {
    path: 'tester/yamlView/:fileName',
    component: YamlViewComponent
  },
  {
    path: 'tester/yamlEdit/:fileName',
    component: YamlEditComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

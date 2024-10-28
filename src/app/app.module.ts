import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MetricsLoaderComponent } from './pages/metrics-loader/metrics-loader.component';
import { ExecutorComponent } from './pages/metrics-loader/executor/executor.component';
import { ViewerComponent } from './pages/metrics-loader/viewer/viewer.component';
import { TpaManagementComponent } from './pages/tpa-management/tpa-management.component';
import {MatDialogModule} from "@angular/material/dialog";
import { TpaDeleteComponent } from './pages/tpa-management/tpa-delete/tpa-delete.component';
import { TpaEditComponent } from './pages/tpa-management/tpa-edit/tpa-edit.component';
import { TpaViewComponent } from './pages/tpa-management/tpa-view/tpa-view.component';
import { AllComponent } from './pages/tpa-management/tpa-edit/all/all.component';
import { SectionsComponent } from './pages/tpa-management/tpa-edit/sections/sections.component';
import { CloneComponent } from './pages/gh-simulator/clone/clone.component';
import { RepositoryComponent } from './pages/gh-simulator/clone/repository/repository.component';
import {GhSimulatorComponent} from "./pages/gh-simulator/gh-simulator.component";
import { LocalComponent } from './pages/gh-simulator/local/local.component';
import { ActionsComponent } from './pages/gh-simulator/local/actions/actions.component';
import { BranchesComponent } from './pages/gh-simulator/local/branches/branches.component';
import { PullRequestComponent } from './pages/gh-simulator/local/pull-request/pull-request.component';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { HomepageComponent } from './pages/home/homepage/homepage.component';
import { GlassmatrixComponent } from './pages/home/glassmatrix/glassmatrix.component';
import { GithubComponent } from './pages/home/github/github.component';
import { LangsComponent } from './pages/home/langs/langs.component';
import { BluejayapiComponent } from './pages/home/bluejayapi/bluejayapi.component';
import { MetricstestsComponent } from './pages/home/metricstests/metricstests.component';
import { TpatestsComponent } from './pages/home/tpatests/tpatests.component';
import { RepositorytesterComponent } from './pages/home/repositorytester/repositorytester.component';
import { ScriptInfoComponent } from './components/dialogs/script-info/script-info.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { BluejayUiComponent } from './components/dialogs/bluejay-ui/bluejay-ui.component';
import { ConfigComponent } from './pages/config/config.component';
import { TokenComponent } from './components/token/token.component';
import { GlTokenComponent } from './components/token/gl-token.component';
import { JiraTokenComponent } from './components/token/jira-token.component';
import { AccessKeyComponent } from './components/access-key/access-key.component';
import { GithubhelpComponent } from './components/dialogs/githubhelp/githubhelp.component';
import { TpaViewerComponent } from './pages/metrics-loader/tpa-viewer/tpa-viewer.component';
import { TpaExecutorComponent } from './pages/metrics-loader/tpa-executor/tpa-executor.component';
import { TestsComponent } from './pages/tests/tests.component';
import { YamlViewComponent } from './pages/tests/yaml-view/yaml-view.component';
import { YamlEditComponent } from './pages/tests/yaml-edit/yaml-edit.component';
import { YamelsComponent } from './components/yamels/yamels.component';
import {NgxPaginationModule} from "ngx-pagination";
import { MatExpansionModule } from '@angular/material/expansion';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './services/error.interceptor';
import { FixedwindowhelpComponent } from './components/dialogs/fixedwindowhelp/fixedwindowhelp.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    MetricsLoaderComponent,
    ExecutorComponent,
    ViewerComponent,
    TpaManagementComponent,
    TpaDeleteComponent,
    TpaEditComponent,
    TpaViewComponent,
    AllComponent,
    SectionsComponent,
    CloneComponent,
    RepositoryComponent,
    GhSimulatorComponent,
    LocalComponent,
    ActionsComponent,
    BranchesComponent,
    PullRequestComponent,
    HomepageComponent,
    GlassmatrixComponent,
    GithubComponent,
    LangsComponent,
    BluejayapiComponent,
    MetricstestsComponent,
    TpatestsComponent,
    RepositorytesterComponent,
    ScriptInfoComponent,
    BluejayUiComponent,
    ConfigComponent,
    TokenComponent,
    GlTokenComponent,
    JiraTokenComponent,
    AccessKeyComponent,
    GithubhelpComponent,
    FixedwindowhelpComponent,
    TpaViewerComponent,
    TpaExecutorComponent,
    TestsComponent,
    YamlViewComponent,
    YamlEditComponent,
    YamelsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    NgxPaginationModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        deps: [HttpClient],
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory

      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

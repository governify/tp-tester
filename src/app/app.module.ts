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
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
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
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        deps: [HttpClient],
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory

      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

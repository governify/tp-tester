import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { TpaLoadedComponent } from './pages/tpa-loaded/tpa-loaded.component';
import { MetricsTesterComponent } from './pages/metrics-tester/metrics-tester.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MetricsLoaderComponent } from './pages/metrics-loader/metrics-loader.component';
import { ExecutorComponent } from './pages/metrics-loader/executor/executor.component';
import { ViewerComponent } from './pages/metrics-loader/viewer/viewer.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    TpaLoadedComponent,
    MetricsTesterComponent,
    MetricsLoaderComponent,
    ExecutorComponent,
    ViewerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

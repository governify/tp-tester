import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Location } from '@angular/common';

@Component({
  selector: 'app-metrics-loader',
  templateUrl: './metrics-loader.component.html',
  styleUrls: ['./metrics-loader.component.css']
})
export class MetricsLoaderComponent implements OnInit {
  files: string[] = [];

  constructor(private http: HttpClient, private location: Location) { }

  ngOnInit(): void {
    this.http.get<string[]>('http://localhost:4202/tpa/files').subscribe(
      (files) => {
        this.files = files;
      },
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }
  goBack(): void {
    this.location.back();
  }
}

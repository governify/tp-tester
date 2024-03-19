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
  message: { text: string; style: string; } | null = null;

  constructor(private http: HttpClient, private location: Location) { }

  ngOnInit(): void {
    this.loadFiles();
  }

  goBack(): void {
    this.location.back();
  }

  deleteFile(fileName: string): void {
    this.http.delete(`http://localhost:4202/glassmatrix/api/v1/tpa/files/${fileName}`).subscribe(
      () => {
        this.message = { text: 'File deleted successfully', style: 'success' }; // Usar 'style' en lugar de 'type'
        this.loadFiles();
      },
      (error) => {
        console.error('An error occurred:', error);
        this.message = { text: 'An error occurred while deleting the file', style: 'error' }; // Usar 'style' en lugar de 'type'
      }
    );
  }

  private loadFiles(): void {
    this.http.get<string[]>('http://localhost:4202/glassmatrix/api/v1/tpa/files').subscribe(
      (files) => {
        this.files = files;
      },
      (error) => {
        console.error('An error occurred:', error);
        this.message = { text: 'An error occurred while loading the files', style: 'error' }; // Asignar un objeto a this.message
      }
    );
  }
}

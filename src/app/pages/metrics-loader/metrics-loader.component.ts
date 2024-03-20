import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GlassmatrixService } from '../../services/glass-matrix.service';

@Component({
  selector: 'app-metrics-loader',
  templateUrl: './metrics-loader.component.html',
  styleUrls: ['./metrics-loader.component.css']
})
export class MetricsLoaderComponent implements OnInit {
  files: string[] = [];
  message: { text: string; style: string; } | null = null;

  constructor(private glassmatrixService: GlassmatrixService, private location: Location) { }

  ngOnInit(): void {
    this.loadFiles();
  }

  goBack(): void {
    this.location.back();
  }

  deleteFile(fileName: string): void {
    this.glassmatrixService.deleteFile(fileName).subscribe(
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
    this.glassmatrixService.loadFiles().subscribe(
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

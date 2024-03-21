import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GlassmatrixService } from '../../services/glass-matrix.service';
import {FilesService} from "../../services/files.service";
import {BluejayService} from "../../services/bluejay.service";

@Component({
  selector: 'app-metrics-loader',
  templateUrl: './metrics-loader.component.html',
  styleUrls: ['./metrics-loader.component.css']
})
export class MetricsLoaderComponent implements OnInit {
  files: string[] = [];
  message: { text: string; style: string; } | null = null;
  data!: string;
  response: string | null = null;
  computationUrl: string | null = null;
  searchTerm!: string;
  searchTermResponse!: string;
  fileName!: string;
  message2 = '';
  messageClass = '';
  isLoading = false;

  constructor(
    private glassmatrixService: GlassmatrixService,
    private location: Location,
    private filesService: FilesService,
    private bluejayService: BluejayService
  ) { }

  ngOnInit(): void {
    this.loadFiles();
    this.filesService.getBasicMetric().subscribe(data => {
      this.data = JSON.stringify(data, null, 2); // Convierte el objeto a una cadena JSON
    });
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

  postContent(): void {
    this.isLoading = true;
    this.bluejayService.postComputation(JSON.parse(this.data)).subscribe(
      (response: any) => {
        this.response = JSON.stringify(response, null, 2);
        this.computationUrl = `http://localhost:5500${response.computation}`;
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error:', error);
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }
  getComputation(): void {
    if (this.computationUrl) {
      this.isLoading = true;
      setTimeout(() => {
        if (this.computationUrl) {
          this.bluejayService.getComputation(this.computationUrl).subscribe(
            (response: any) => {
              this.response = JSON.stringify(response, null, 2);
              this.isLoading = false;
            },
            (error: any) => {
              console.error('Error:', error);
              this.isLoading = false;
            },
            () => {
              this.isLoading = false;
            }
          );
        }
      }, 5000);
    }
  }

  search() {
    const textarea = document.getElementById('dataTextarea') as HTMLTextAreaElement;
    const index = this.data.indexOf(this.searchTerm);
    if (index !== -1) {
      textarea.focus();
      textarea.setSelectionRange(index, index + this.searchTerm.length);
      const lineHeight = textarea.clientHeight / textarea.rows;
      const jump = (textarea.value.substr(0, index).match(/\n/g) || []).length;
      textarea.scrollTo(0, jump * lineHeight);
    } else {
      alert('Word not found!');
    }
  }
  searchResponse() {
    const textarea = document.getElementById('responseTextarea') as HTMLTextAreaElement;
    // @ts-ignore
    const index = this.response.indexOf(this.searchTermResponse);
    if (index !== -1) {
      textarea.focus();
      textarea.setSelectionRange(index, index + this.searchTermResponse.length);
      const lineHeight = textarea.clientHeight / textarea.rows;
      const jump = (textarea.value.substr(0, index).match(/\n/g) || []).length;
      textarea.scrollTo(0, jump * lineHeight);
    } else {
      alert('Word not found in response!');
    }
  }

  saveToJson(): void {
    if (!this.fileName) {
      this.message2 = 'Filename cannot be empty';
      this.messageClass = 'error';
      return;
    }

    const data = JSON.parse(this.data);
    this.glassmatrixService.saveToJson(this.fileName, data).subscribe(
      () => {
        this.message2 = 'File saved successfully';
        this.messageClass = 'success';
      },
      (error) => {
        this.message2 = 'An error occurred: ' + error;
        this.messageClass = 'error';
      }
    );
  }


}

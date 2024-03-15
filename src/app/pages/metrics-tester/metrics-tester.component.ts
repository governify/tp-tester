import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-metrics-tester',
  templateUrl: './metrics-tester.component.html',
  styleUrls: ['./metrics-tester.component.css']
})
export class MetricsTesterComponent implements OnInit {
  data!: string; // Cambia el tipo de 'data' a 'string'
  response: string | null = null;
  computationUrl: string | null = null;
  searchTerm!: string;
  searchTermResponse!: string;
  constructor(private http: HttpClient) { }
  isLoading = false;
  ngOnInit(): void {
    this.http.get('assets/basicMetric.json').subscribe(data => {
      this.data = JSON.stringify(data, null, 2); // Convierte el objeto a una cadena JSON
    });

  }

  postContent(): void {
    this.isLoading = true;
    this.http.post('http://localhost:5500/api/v2/computations', JSON.parse(this.data)).subscribe(
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
        if (this.computationUrl) { // Asegúrate de que 'this.computationUrl' no es 'null'
          this.http.get(this.computationUrl).subscribe(
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
}

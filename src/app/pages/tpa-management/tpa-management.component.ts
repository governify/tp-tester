import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-tpa-management',
  templateUrl: './tpa-management.component.html',
  styleUrls: ['./tpa-management.component.css']
})
export class TpaManagementComponent implements OnInit {
  tps: any;
  private url = 'http://localhost:5400/api/v6/agreements';
  tpaContent!: string;
  notificationMessage: string = '';
  lastOperationSuccessful: boolean | null = null;
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.http.get<any>(this.url).subscribe(data => {
      this.tps = data;
    });
  }

  createTpa() {
    const tpaData = JSON.parse(this.tpaContent);
    this.http.post(`http://localhost:5400/api/v6/agreements/`, tpaData, {responseType: 'text'}).subscribe(
      () => {
        this.notificationMessage = 'TPA created successfully!';
        this.lastOperationSuccessful = true;
        // Reload the TPA data from the server
        this.http.get<any>(this.url).subscribe(data => {
          this.tps = data;
        });
      },
      (error) => {
        this.notificationMessage = 'Error creating TPA: ' + error.message;
        this.lastOperationSuccessful = false;
      }
    );
  }

  copyDefaultTPA() {
    this.http.get('assets/defaultTPA.json', {responseType: 'text'}).subscribe(data => {
      this.tpaContent = data;
    });
  }
}

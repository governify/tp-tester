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
  tpaToDelete!: string;
  showDialog = false; // Variable para controlar la visualización del diálogo
  private url = 'http://localhost:5400/api/v6/agreements';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.http.get<any>(this.url).subscribe(data => {
      this.tps = data;
    });
  }


}

import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.css']
})
export class SectionsComponent implements OnInit {

  tpaId!: string;
  tpaData: any;
  tpaDataJson!: string; // Añade esta línea

  metrics: any = {};
  metricsJson: { [key: string]: string } = {}; // Añade esta línea

  guarantees: any[] = [];
  guaranteesJson: string[] = []; // Añade esta línea

  constructor(private http: HttpClient, private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.tpaId = id;
        this.http.get(`http://localhost:5400/api/v6/agreements/${id}`).subscribe(data => {
          this.tpaData = data;
          this.tpaDataJson = JSON.stringify(this.tpaData, null, 2);
          if (this.tpaData && this.tpaData.terms && this.tpaData.terms.metrics) {
            this.metrics = this.tpaData.terms.metrics;
            for (const key in this.metrics) {
              if (Object.prototype.hasOwnProperty.call(this.metrics, key)) {
                this.metricsJson[key] = JSON.stringify(this.metrics[key], null, 2);
              }
            }
          } else {
            console.error('Cannot read, invalid data');
          }
          if (this.guarantees && this.tpaData.terms && this.tpaData.terms.guarantees) {
            this.guarantees = this.tpaData.terms.guarantees;
            for (let i = 0; i < this.guarantees.length; i++) {
              this.guaranteesJson[i] = JSON.stringify(this.guarantees[i], null, 2);
            }
          } else {
            console.error('Cannot read, invalid data');
          }
        });
      }
    });
  }
  getKeyAsString(key: unknown): string {
    return String(key);
  }
  goBack() {
    this.location.back();
  }
}

import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { ActivatedRoute } from '@angular/router';
import {Location} from "@angular/common";

@Component({
  selector: 'app-tpa-view',
  templateUrl: './tpa-view.component.html',
  styleUrls: ['./tpa-view.component.css']
})
export class TpaViewComponent implements OnInit {
  tpaId!: string;
  tpaData: any;

  metrics: any = {};
  guarantees: any[] = [];
  constructor(private http: HttpClient, private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.tpaId = id;
        this.http.get(`http://localhost:5400/api/v6/agreements/${id}`).subscribe(data => {
          this.tpaData = data;
          if (this.tpaData && this.tpaData.terms && this.tpaData.terms.metrics) {
            this.metrics = this.tpaData.terms.metrics;
          } else {
            console.error('Cannot read, invalid data');
          }
          if (this.guarantees && this.tpaData.terms && this.tpaData.terms.guarantees) {
            this.guarantees = this.tpaData.terms.guarantees;
          } else {
            console.error('Cannot read, invalid data');
          }
        });
      }
    });
  }

  goBack() {
    this.location.back();
  }
}

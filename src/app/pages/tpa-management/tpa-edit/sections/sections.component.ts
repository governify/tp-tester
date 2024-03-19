import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BluejayService } from '../../../../services/bluejay.service';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.css']
})
export class SectionsComponent implements OnInit {

  tpaId!: string;
  tpaData: any;
  tpaDataJson!: string;
  metrics: any = {};
  metricsJson: { [key: string]: string } = {};
  guarantees: any[] = [];
  guaranteesJson: string[] = [];

  constructor(private bluejayService: BluejayService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.tpaId = id;
        this.bluejayService.getTpa(id).subscribe(data => {
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

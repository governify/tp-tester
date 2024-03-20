import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Location} from "@angular/common";
import {BluejayService} from "../../../services/bluejay.service";

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
  constructor(private bluejayService: BluejayService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.tpaId = id;
        this.bluejayService.getTpa(id).subscribe(data => {
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

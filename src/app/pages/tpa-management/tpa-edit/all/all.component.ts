import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.css']
})
export class AllComponent implements OnInit {

  tpaId!: string;
  tpaData: any;
  tpaDataJson!: string;
  notificationMessage: string = '';
  lastOperationSuccessful: boolean | null = null;
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
          this.tpaDataJson = JSON.stringify(this.tpaData, null, 2);
        });
      }
    });
  }
  updateTpa() {
    this.tpaData = JSON.parse(this.tpaDataJson);
    this.http.delete(`http://localhost:5400/api/v6/agreements/${this.tpaId}`, {responseType: 'text'}).subscribe(
      () => {
        this.http.post(`http://localhost:5400/api/v6/agreements/`, this.tpaData, {responseType: 'text'}).subscribe(
          () => {
            this.notificationMessage = 'TPA updated successfully!';
            this.lastOperationSuccessful = true;
          },
          (error) => {
            this.notificationMessage = 'Error updating TPA: ' + error.message;
            this.lastOperationSuccessful = false;
          }
        );
      },
      (error) => {
        this.notificationMessage = 'Error deleting TPA: ' + error.message;
        this.lastOperationSuccessful = false;
      }
    );
  }
  goBack() {
    this.location.back();
  }
}

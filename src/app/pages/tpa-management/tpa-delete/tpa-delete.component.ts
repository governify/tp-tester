import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {Location} from "@angular/common";

@Component({
  selector: 'app-tpa-delete',
  templateUrl: './tpa-delete.component.html',
  styleUrls: ['./tpa-delete.component.css']
})
export class TpaDeleteComponent implements OnInit {
  tpaId!: string;
  tpaData!: string;

  constructor(private http: HttpClient, private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log(id)
      if (id) {
        this.tpaId = id;
        this.http.get(`http://localhost:5400/api/v6/agreements/${id}`).subscribe(data => {
          console.log(data); // Añade esta línea
          this.tpaData = JSON.stringify(data, null, 2);
        });
      }
    });
  }

  deleteTpa() {
    this.http.delete(`http://localhost:5400/api/v6/agreements/${this.tpaId}`, {responseType: 'text'}).subscribe(() => {
      this.location.back();
    });
  }
  goBack() {
    this.location.back();
  }
}

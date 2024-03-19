import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BluejayService } from '../../../services/bluejay.service';

@Component({
  selector: 'app-tpa-delete',
  templateUrl: './tpa-delete.component.html',
  styleUrls: ['./tpa-delete.component.css']
})
export class TpaDeleteComponent implements OnInit {
  tpaId!: string;
  tpaData!: string;

  constructor(private bluejayService: BluejayService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log(id)
      if (id) {
        this.tpaId = id;
        this.bluejayService.getTpa(id).subscribe(data => {
          console.log(data);
          this.tpaData = JSON.stringify(data, null, 2);
        });
      }
    });
  }

  deleteTpa() {
    this.bluejayService.deleteTpa(this.tpaId).subscribe(() => {
      this.location.back();
    });
  }
  goBack() {
    this.location.back();
  }
}

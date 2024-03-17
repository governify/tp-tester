import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tpa-edit',
  templateUrl: './tpa-edit.component.html',
  styleUrls: ['./tpa-edit.component.css']
})
export class TpaEditComponent implements OnInit {
  tpaId!: string;

  constructor(private router: Router, private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.tpaId = id;

      }
    });
  }



  editAll(): void {
    this.router.navigate([`/tpa-management/edit/all/${this.tpaId}`]);
  }

  editSections(): void {
    this.router.navigate([`/tpa-management/edit/sections/${this.tpaId}`]);
  }

  goBack(): void {
    this.location.back();
  }
}

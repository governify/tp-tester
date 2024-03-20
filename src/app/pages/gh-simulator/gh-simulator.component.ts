import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-gh-simulator',
  templateUrl: './gh-simulator.component.html',
  styleUrls: ['./gh-simulator.component.css']
})
export class GhSimulatorComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {

  }


  editAll(): void {
    this.router.navigate([`/gh-simulator/clone`]);
  }

  editSections(): void {
    this.router.navigate([`/gh-simulator/local`]);
  }

}

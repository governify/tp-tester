import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {GlassmatrixService} from "../../../services/glass-matrix.service";


@Component({
  selector: 'app-local',
  templateUrl: './local.component.html',
  styleUrls: ['./local.component.css']
})
export class LocalComponent implements OnInit {
  repositories: string[] = [];

  constructor(private glassmatrixService: GlassmatrixService, private location: Location) { }

  ngOnInit(): void {
    this.getRepos();
  }

  goBack(): void {
    this.location.back();
  }

  getRepos(): void {
    this.glassmatrixService.listRepos().subscribe(data => {
      this.repositories = data.repositories;
    });
  }

  deleteRepo(repo: string): void {
    this.glassmatrixService.deleteRepo(repo).subscribe(
      () => {
        this.getRepos();
      },
      error => {
        console.error('Error deleting repository:', error);
      }
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";

@Component({
  selector: 'app-local',
  templateUrl: './local.component.html',
  styleUrls: ['./local.component.css']
})
export class LocalComponent implements OnInit {
  repositories: string[] = [];
  private apiUrl = 'http://localhost:4202';

  constructor(private http: HttpClient, private location: Location) { }

  ngOnInit(): void {
    this.http.get<any>(`${this.apiUrl}/listRepos`).subscribe(data => {
      this.repositories = data.repositories;
    });
  }

  goBack(): void {
    this.location.back();
  }

  editRepo(repo: string): void {
    // Implement your repository editing logic here
  }
}

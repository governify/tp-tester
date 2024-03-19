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
    this.getRepos();
  }

  goBack(): void {
    this.location.back();
  }

  getRepos(): void {
    this.http.get<any>(`${this.apiUrl}/glassmatrix/api/v1/github/listRepos`).subscribe(data => {
      this.repositories = data.repositories;
      console.log(this.repositories);
    });
  }
  editRepo(repo: string): void {
    // Implement your repository editing logic here
  }

  deleteRepo(repo: string): void {
    this.http.delete(`${this.apiUrl}/deleteRepo/${repo}`).subscribe(
      () => {
        this.getRepos(); // Refresh the list of repositories
      },
      error => {
        console.error('Error deleting repository:', error);
      }
    );
  }
}

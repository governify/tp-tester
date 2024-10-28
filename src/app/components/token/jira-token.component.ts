import { Component, OnInit } from '@angular/core';
import {GlassmatrixService} from "../../services/glass-matrix.service";

@Component({
  selector: 'app-jira-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class JiraTokenComponent implements OnInit {
  token!: string[];
  showToken = false;
  showEdit = false;
  newToken!: string[];

  constructor(private glassmatrixService: GlassmatrixService) { }

  ngOnInit(): void {
    this.getToken();
  }

  getToken(): void {
    this.glassmatrixService.getJiraToken().subscribe(
      response => {
        this.token = response.token;
      },
      () => this.token = ['Token not found']
    );
  }

  saveToken(): void {
    this.glassmatrixService.saveJiraToken(this.newToken).subscribe(
      () => {
        this.token = this.newToken;
        this.newToken = [''];
        window.location.reload();
      },
      () => this.token = ['Failed to save token']
    );
  }

  updateToken(): void {
    this.glassmatrixService.deleteJiraToken().subscribe(
      () => {
        this.saveToken();
        this.showEdit = false;
        this.showToken = false;
      },
      () => this.token = ['Failed to update token']
    );
  }
}

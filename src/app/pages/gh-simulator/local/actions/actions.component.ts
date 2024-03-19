import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent {
  branches: string[] = [];
  currentBranch: string = '';
  repoName!: string | null;
  fileContent: string = '';
  files: string[] = [];
  fileName: string = '';
  commitMessage: string = '';
  branchToChangeTo: string | null = null;
  message: string = '';
  private apiUrl = 'http://localhost:4202/glassmatrix/api/v1/github';
  constructor(private http: HttpClient, private route: ActivatedRoute, private location: Location) {
    this.route.paramMap.subscribe(params => {
      this.repoName = params.get('repoName');
      this.getBranches();
      this.getFiles();
    });
  }

  getBranches() {
    this.http.get<{ branches: string[] }>(`${this.apiUrl}/branches/${this.repoName}`).subscribe(
      res => {
        this.branches = res.branches;
        this.message = 'Branches fetched successfully'; // Modify this line
      },
      err => {
        this.message = 'Error getting branches: ' + err; // Modify this line
      }
    );
  }
/*
  changeBranch(branchName: string) {
    this.http.post(`http://localhost:4202/changeBranch/${this.repoName}/${branchName}`, {}).subscribe(
      res => {
        console.log('Branch changed successfully');
        this.currentBranch = branchName;
        this.getBranches(); // Update branches after changing
      },
      err => {
        console.error('Error changing branch:', err);
      }
    );
  }
*/
  goBack(): void {
    this.location.back();
  }
  changeBranch() {
    this.http.post(`${this.apiUrl}/changeBranch/${this.repoName}/${this.branchToChangeTo}`, {}).subscribe(() => {
      this.getBranches();
    });
  }

  getFiles() {
    this.http.get<{ files: string[] }>(`${this.apiUrl}/files/${this.repoName}`).subscribe(
      res => {
        this.files = res.files;
      },
      err => {
        console.error('Error getting files:', err);
      }
    );
  }
  createFile() {
    this.http.post(`${this.apiUrl}/createFile/${this.repoName}`, { fileName: this.fileName, fileContent: this.fileContent }).subscribe(
      res => {
        this.message = 'File created successfully'; // Modify this line
        this.getFiles();
      },
      err => {
        this.message = 'Error creating file: ' + err; // Modify this line
      }
    );
  }
  //http://localhost:4202/glassmatrix/api/v1/github/push/repoName
  pushChanges() {
    this.http.post(`${this.apiUrl}/push/${this.repoName}`, {}).subscribe(
      res => {
        console.log('Changes pushed successfully');
      },
      err => {
        console.error('Error pushing changes:', err);
      }
    );
  }
  createCommit() {
    this.http.post(`${this.apiUrl}/commit/${this.repoName}`, { fileContent: this.fileContent, commitMessage: this.commitMessage }).subscribe(
      res => {
        console.log('Commit created');
        this.getFiles();
      },
      err => {
        console.error('Error creating commit:', err);
      }
    );
  }
}

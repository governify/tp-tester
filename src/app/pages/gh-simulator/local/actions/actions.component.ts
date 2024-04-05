import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Location} from "@angular/common";
import {GlassmatrixService} from "../../../../services/glass-matrix.service";
import {GithubService} from "../../../../services/github.service";

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
  token: string = '';
  owner: string = '';
  issues: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private glassmatrixService: GlassmatrixService,
    private githubService: GithubService
    ) {
    this.route.paramMap.subscribe(params => {
      this.repoName = params.get('repoName');
      this.getBranches();
      this.getFiles();
      this.getToken();
      this.getIssues()
    });
  }

  getToken(): void {
    this.glassmatrixService.getToken().subscribe(
      response => {
        this.token = response.token;
        this.githubService.getUserName(this.token).subscribe(
          owner => {
            this.owner = owner;
            this.getBranches();
            this.getIssues();
          },
          error => console.error('Error getting owner:', error)
        );
      },
      () => this.token = 'Token not found'
    );
  }
  getBranches() {
    this.glassmatrixService.getBranches(this.repoName!).subscribe(
      res => {
        this.branches = res.branches;
        this.message = 'Branches fetched successfully';
      },
      err => {
        this.message = 'Error getting branches: ' + err;
      }
    );
  }

  goBack(): void {
    this.location.back();
  }
  changeBranch() {
    this.glassmatrixService.changeBranch(this.repoName!, this.branchToChangeTo!).subscribe(() => {
      this.getBranches();
    });
  }

  getFiles() {
    this.glassmatrixService.getFiles(this.repoName!).subscribe(
      res => {
        this.files = res.files;
      },
      err => {
        console.error('Error getting files:', err);
      }
    );
  }
  createFile() {
    this.glassmatrixService.createFile(this.repoName!, this.fileName, this.fileContent).subscribe(
      res => {
        this.message = 'File created successfully';
        this.getFiles();
      },
      err => {
        this.message = 'Error creating file: ' + err;
      }
    );
  }
  pushChanges() {
    this.glassmatrixService.pushChanges(this.repoName!).subscribe(
      res => {
        console.log('Changes pushed successfully');
      },
      err => {
        console.error('Error pushing changes:', err);
      }
    );
  }
  createCommit() {
    this.glassmatrixService.createCommit(this.repoName!, this.fileContent, this.commitMessage).subscribe(
      res => {
        console.log('Commit created');
        this.getFiles();
      },
      err => {
        console.error('Error creating commit:', err);
      }
    );
  }

  // Método para obtener las issues de un repositorio
  getIssues() {
    if (this.owner && this.repoName) {
      this.githubService.getIssues(this.token, this.owner, this.repoName).subscribe(
        issues => {
          this.issues = issues;
        },
        error => {
          console.error('Error getting issues:', error);
        }
      );
    } else {
      console.error('Owner or repo name is not defined');
    }
  }

// Método para crear una issue en un repositorio
  createIssue(title: string, body: string) {
    if (this.owner && this.repoName) {
      this.githubService.createIssue(this.token, this.owner, this.repoName, {title, body}).subscribe(
        issue => {
          console.log('Issue created:', issue);
          this.getIssues(); // Actualizar la lista de issues
        },
        error => {
          console.error('Error creating issue:', error);
        }
      );
    } else {
      console.error('Owner or repo name is not defined');
    }
  }
}

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Location} from "@angular/common";
import {GlassmatrixService} from "../../../../services/glass-matrix.service";

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

  constructor(private route: ActivatedRoute, private location: Location, private glassmatrixService: GlassmatrixService) {
    this.route.paramMap.subscribe(params => {
      this.repoName = params.get('repoName');
      this.getBranches();
      this.getFiles();
    });
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
}

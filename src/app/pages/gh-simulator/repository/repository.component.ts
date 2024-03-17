import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GithubService } from "../../../github.service";
import { FormBuilder, FormGroup } from '@angular/forms';
import { from } from 'rxjs';
@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.css']
})
export class RepositoryComponent implements OnInit {
  owner: string | null = null;
  repoName: string | null = null;
  repoInfo: any = null;
  branches: any[] = [];
  newBranchForm: FormGroup;
  newFileForm: FormGroup;

  constructor(private route: ActivatedRoute, private githubService: GithubService, private formBuilder: FormBuilder) {
    this.newBranchForm = this.formBuilder.group({
      branchName: ''
    });

    this.newFileForm = this.formBuilder.group({
      fileName: '',
      fileContent: ''
    });
  }

  ngOnInit(): void {
    this.owner = this.route.snapshot.paramMap.get('owner');
    this.repoName = this.route.snapshot.paramMap.get('repoName');
    console.log('Owner:', this.owner);
    console.log('Repo Name:', this.repoName);
    if (this.owner && this.repoName) {
      this.githubService.getRepoInfo(this.owner, this.repoName).subscribe(
        repoInfo => {
          this.repoInfo = repoInfo;
          console.log(repoInfo);
        }
      );

      this.githubService.listBranchesForRepo(this.owner, this.repoName).subscribe(
        branches => {
          this.branches = branches;
        }
      );
    }
  }

  createBranch(): void {
    const branchName = this.newBranchForm.get('branchName')?.value;

    if (this.owner && this.repoName && branchName) {
      // Convert the Promise to an Observable
      from(this.githubService.getLatestCommitSha(this.owner as string, this.repoName as string)).subscribe(sha => {
        from(this.githubService.createBranch(this.owner as string, this.repoName as string, branchName, sha)).subscribe(
          () => {
            this.branches.push(branchName);
            this.newBranchForm.reset();
          }
        );
      });
    }
  }

  // Remove one of the duplicate methods
  createFileAndCommit(): void {
    const fileName = this.newFileForm.get('fileName')?.value;
    const fileContent = this.newFileForm.get('fileContent')?.value;

    if (this.owner && this.repoName && fileName && fileContent) {
      const path = `path/to/${fileName}`; // Make sure to provide the correct path
      const message = 'Commit message'; // Provide the commit message
      const branch = 'branch-name'; // Provide the branch name

      // Use `then` instead of `subscribe`
      this.githubService.createFile(this.owner, this.repoName, path, message, btoa(fileContent), branch).then(
        () => {
          this.newFileForm.reset();
        }
      );
    }
  }
}

import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { GithubService } from "../../../../services/github.service";
import { FormBuilder, FormGroup } from '@angular/forms';
import {GlassmatrixService} from "../../../../services/glass-matrix.service";
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

  constructor(
    private route: ActivatedRoute,
    private githubService: GithubService,
    private glassmatrixService: GlassmatrixService,
    private formBuilder: FormBuilder,
    private router: Router) {
    this.newBranchForm = this.formBuilder.group({
      branchName: ''
    });

    this.newFileForm = this.formBuilder.group({
      fileName: '',
      fileContent: '',
      branch: ''
    });
  }

  ngOnInit(): void {
    this.owner = this.route.snapshot.paramMap.get('owner');
    this.repoName = this.route.snapshot.paramMap.get('repoName');
    if (this.owner && this.repoName) {
      this.githubService.getRepoInfo(this.owner, this.repoName).subscribe(
        repoInfo => {
          this.repoInfo = repoInfo;
        }
      );

      this.githubService.listBranchesForRepo(this.owner, this.repoName).subscribe(
        branches => {
          this.branches = branches;
        }
      );
    }
  }

  cloneRepo(): void {
    if (this.owner && this.repoName) {
      this.glassmatrixService.cloneRepo(this.owner, this.repoName)
        .subscribe(
          () => {
            this.router.navigate(['/gh-simulator/local']);
          },
          error => console.error('Error cloning repository', error)
        );
    }
  }
}

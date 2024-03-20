import { Component, OnInit } from '@angular/core';
import {GithubService} from "../../../../services/github.service";
import {Observable, switchMap} from "rxjs";
import { ActivatedRoute } from '@angular/router';
import {Location} from "@angular/common";
import {GlassmatrixService} from "../../../../services/glass-matrix.service";

@Component({
  selector: 'app-pull-request',
  templateUrl: './pull-request.component.html',
  styleUrls: ['./pull-request.component.css']
})
export class PullRequestComponent implements OnInit {
  token!: string;
  owner!: Observable<string>;
  repo!: string;
  prTitle!: string;
  branches: string[] = [];
  openPullRequests: any[] = [];
  prHead!: string;
  prBase!: string;
  prBody!: string;
  mergePrNumber!: number;
  mergeCommitMessage!: string;
  message: string = '';
  message2: string = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(private githubService: GithubService, private route: ActivatedRoute, private location: Location, private glassmatrixService: GlassmatrixService) { }

  ngOnInit(): void {
    this.getToken();
    this.repo = this.route.snapshot.paramMap.get('repoName') || '';
  }

  getToken(): void {
    this.glassmatrixService.getToken().subscribe(
      response => {
        this.token = response.token;
        this.owner = this.githubService.getUserName(this.token);
        this.getBranches();
        this.getOpenPullRequests();
      },
      () => this.token = 'Token not found'
    );
  }

  createPullRequest(): void {
    this.owner.subscribe(owner => {
      this.githubService.createPullRequest(this.token, owner, this.repo, this.prTitle, this.prHead, this.prBase, this.prBody).subscribe(
        res => {
          this.message = 'Pull request successfully created';
          this.messageType = 'success';
        },
        err => {
          this.message = 'Error creating the pull request: ' + err;
          this.messageType = 'error';
        }
      );
    });
  }

  getOpenPullRequests(): void {
    this.owner.subscribe(owner => {
      this.githubService.getOpenPullRequests(this.token, owner, this.repo).subscribe(
        response => {
          this.openPullRequests = response;
        },
        error => console.error(error)
      );
    });
  }

  mergePullRequest(): void {
    this.owner.pipe(
      switchMap(owner => {
        return this.githubService.mergePullRequest(this.token, owner, this.repo, this.mergePrNumber, this.mergeCommitMessage);
      })
    ).subscribe(
      res => {
        this.message2 = 'Pull request successfully created';
        this.messageType = 'success';
      },
      err => {
        this.message2 = 'Error creating the pull request: ' + err;
        this.messageType = 'error';
      }
    );
  }

  getBranches(): void {
    this.owner.subscribe(owner => {
      this.githubService.getBranches(this.token, owner, this.repo).subscribe(
        response => {
          this.branches = response.map(branch => branch.name);
        },
        error => console.error(error)
      );
    });
  }

  goBack(): void {
    this.location.back();
  }
}

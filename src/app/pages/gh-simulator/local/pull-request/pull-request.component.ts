import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GithubService} from "../../../../github.service";
import {Observable, switchMap} from "rxjs";
import { ActivatedRoute } from '@angular/router';
import {Location} from "@angular/common";

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
  private apiUrl = 'https://api.github.com';
  message: string = '';
  message2: string = '';
  messageType: 'success' | 'error' | '' = '';


  constructor(private http: HttpClient, private githubService: GithubService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    this.getToken();
    this.repo = this.route.snapshot.paramMap.get('repoName') || '';
  }

  getToken(): void {
    this.http.get<{ token: string }>('http://localhost:4202/glassmatrix/api/v1/github/token/get').subscribe(
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
      const url = `${this.apiUrl}/repos/${owner}/${this.repo}/pulls`;
      const headers = {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github+json'
      };
      const data = { title: this.prTitle, head: this.prHead, base: this.prBase, body: this.prBody };

      this.http.post(url, data, { headers }).subscribe(
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
      const url = `${this.apiUrl}/repos/${owner}/${this.repo}/pulls?state=open`;
      const headers = {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github+json'
      };

      this.http.get<any[]>(url, { headers }).subscribe(
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
        const url = `${this.apiUrl}/repos/${owner}/${this.repo}/pulls/${this.mergePrNumber}/merge`;
        const headers = {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/vnd.github+json'
        };
        const data = {commit_message: this.mergeCommitMessage};

        return this.http.put(url, data, {headers});
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
      const url = `${this.apiUrl}/repos/${owner}/${this.repo}/branches`;
      const headers = {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github+json'
      };

      this.http.get<any[]>(url, { headers }).subscribe(
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

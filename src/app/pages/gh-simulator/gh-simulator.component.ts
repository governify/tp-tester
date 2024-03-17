import { Component, OnInit } from '@angular/core';
import {GithubService} from "../../github.service";
import {HttpClient} from "@angular/common/http";
import {catchError, concatMap, switchMap, throwError, timer} from "rxjs";

@Component({
  selector: 'app-gh-simulator',
  templateUrl: './gh-simulator.component.html',
  styleUrls: ['./gh-simulator.component.css']
})
export class GhSimulatorComponent implements OnInit {
  username!: string;
  owner!: string;
  message!: string;
  tree!: string;
  title!: string;
  base!: string;
  body!: string;
  constructor(private githubService: GithubService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getToken();
  }
  token!: string;

  getToken(): void {
    this.http.get<{ token: string }>('http://localhost:4202/token/get').subscribe(
      response => {
        this.token = response.token;
        this.getRepos();
      },
      () => this.token = 'Token not found'
    );
  }
  newToken!: string;

  saveToken(): void {
    this.http.post('http://localhost:4202/token/save', { token: this.newToken }).subscribe(
      () => {
        this.token = this.newToken;
        this.newToken = '';
      },
      () => this.token = 'Failed to save token'
    );
  }
  reposInfo: any[] = [];

  error = false;
  getRepos(): void {
    this.githubService.listRepos(this.token).subscribe(
      repos => {
        repos.forEach((repo: { owner: { login: string; }; name: string; updated_at: any; html_url: any; }) => {
          this.githubService.listBranchesForRepo(repo.owner.login, repo.name).pipe(
            catchError(error => {
              if (error.status === 429 || error.status === 403) {
                console.log('Rate limit exceeded. Retrying in 1 minute...');
                console.log('Error:', error.message);
                return timer(60000).pipe(
                  switchMap(() => this.githubService.listBranchesForRepo(repo.owner.login, repo.name))
                );
              }
              return throwError(error);
            })
          ).subscribe(
            branches => {
              this.reposInfo.push({
                name: repo.name,
                branches: branches.length,
                lastUpdate: repo.updated_at,
                url: repo.html_url
              });
            },
            error => console.error('Error getting branches:', error)
          );
        });
      },
      error => {
        console.error('Error getting repos:', error);
        this.error = true;
      }
    );
  }

  showToken = false;
  showEdit = false;

  updateToken(): void {
    this.http.delete('http://localhost:4202/token/delete').subscribe(
      () => {
        this.saveToken();
        this.showEdit = false;
        this.showToken = false;
        location.reload();
      },
      () => this.token = 'Failed to update token'
    );
  }
}

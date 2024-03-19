import { Component, OnInit } from '@angular/core';
import {GithubService} from "../../../github.service";
import {HttpClient} from "@angular/common/http";
import {catchError, concatMap, switchMap, throwError, timer} from "rxjs";
import {Router} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-gh-simulator',
  templateUrl: './clone.component.html',
  styleUrls: ['./clone.component.css']
})
export class CloneComponent implements OnInit {
  username!: string;
  owner!: string;
  message!: string;
  tree!: string;
  title!: string;
  base!: string;
  body!: string;
  errorMessage!: any;
  reposInfo: any[] = [];
  token!: string;
  error = false;
  error2 = false;
  showToken = false;
  showEdit = false;
  newToken!: string;
  repoOwner!: string;
  constructor(private githubService: GithubService, private http: HttpClient, private router: Router, private location: Location) { }

  ngOnInit(): void {
    this.getToken();
  }

  getToken(): void {
    this.http.get<{ token: string }>('http://localhost:4202/token/get').subscribe(
      response => {
        this.token = response.token;
        this.getRepos();
      },
      () => this.token = 'Token not found'
    );
  }

  saveToken(): void {
    this.http.post('http://localhost:4202/token/save', { token: this.newToken }).subscribe(
      () => {
        this.token = this.newToken;
        this.newToken = '';
      },
      () => this.token = 'Failed to save token'
    );
  }

  getRepos(): void {
    this.githubService.listRepos(this.token).subscribe(
      repos => {
        repos.forEach((repo: any) => {
          //console.log(repo.owner);
          console.log(repo.owner.login);
          console.log(repo.name);
          this.repoOwner = repo.owner.login;
          if (repo.name && repo.owner.login) {
            this.githubService.listBranchesForRepo(repo.owner.login, repo.name).pipe(
              catchError(error => {
                if (error.status === 429) {
                  console.log('Rate limit exceeded. Retrying in 1 minute...');
                  console.log('Error:', error.message);
                  this.error2 = true;
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
                  url: repo.html_url,
                  owner: repo.owner.login
                });
              },
              error => {
                console.error('Error getting branches:', error);
                this.errorMessage = error.error.message;
              }
            );
          } else {
            console.error('Repo owner or owner login is undefined for repo:', repo);
          }
        });
      },
      error => {
        console.error('Error getting repos:', error);
        this.error = true;
      }
    );
  }
  goBack(): void {
    this.location.back();
  }
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

  editRepo(repoName: string): void {

    if (this.repoOwner && repoName) {
      this.router.navigate(['/gh-simulator/repository', this.repoOwner, repoName]);
    } else {
      console.error('Owner or repoName is undefined');
    }
  }
}

import { Component, OnInit } from '@angular/core';
import {GithubService} from "../../../services/github.service";
import {catchError, concatMap, switchMap, throwError, timer} from "rxjs";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {GlassmatrixService} from "../../../services/glass-matrix.service";

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
  repoOwner!: string;
  constructor(private githubService: GithubService, private glassmatrixService: GlassmatrixService, private router: Router, private location: Location) { }

  ngOnInit(): void {
    this.getToken();
  }

  getToken(): void {
    this.glassmatrixService.getToken().subscribe(
      response => {
        this.token = response.token;
        this.getRepos();
      },
      () => this.token = 'Token not found'
    );
  }


  getRepos(): void {
    this.githubService.listRepos(this.token).subscribe(
      repos => {
        repos.forEach((repo: any) => {
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

  editRepo(repoName: string): void {

    if (this.repoOwner && repoName) {
      this.router.navigate(['/gh-simulator/repository', this.repoOwner, repoName]);
    } else {
      console.error('Owner or repoName is undefined');
    }
  }
}

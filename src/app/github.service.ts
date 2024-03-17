import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Octokit } from '@octokit/rest';
import {catchError, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private octokit: Octokit;

  constructor(private http: HttpClient) {
    this.octokit = new Octokit();
  }
  listBranchesForRepo(owner: string, repo: string): Observable<any> {
    return this.http.get(`https://api.github.com/repos/${owner}/${repo}/branches`);
  }
  async login(token: string) {
    if (typeof token !== 'string') {
      throw new Error('Token must be a string');
    }

    this.octokit = new Octokit({
      auth: token,
    });
  }
  listRepos(token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `token ${token}` });
    return this.http.get('https://api.github.com/user/repos', { headers }).pipe(
      catchError(error => {
        console.error('Error getting repos:', error);
        return throwError('Error getting repos');
      })
    );
  }
  async cloneRepo(repoUrl: string) {
    const [owner, repo] = repoUrl.split('/').slice(-2);
    const { data } = await this.octokit.repos.get({
      owner,
      repo
    });
    return data;
  }

  async listBranches(owner: string, repo: string) {
    const { data } = await this.octokit.repos.listBranches({
      owner,
      repo
    });
    return data;
  }

  async createBranch(owner: string, repo: string, branchName: string, ref: string) {
    const { data } = await this.octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: ref
    });
    return data;
  }

  async commit(owner: string, repo: string, message: string, tree: string, parents: string[]) {
    const { data } = await this.octokit.git.createCommit({
      owner,
      repo,
      message,
      tree,
      parents
    });
    return data;
  }

  async push(owner: string, repo: string, ref: string, sha: string) {
    const { data } = await this.octokit.git.updateRef({
      owner,
      repo,
      ref,
      sha
    });
    return data;
  }

  async pullRequest(owner: string, repo: string, title: string, head: string, base: string, body: string) {
    const { data } = await this.octokit.pulls.create({
      owner,
      repo,
      title,
      head,
      base,
      body
    });
    return data;
  }
}

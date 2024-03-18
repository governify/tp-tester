import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Octokit } from '@octokit/rest';
import {catchError, map, Observable, switchMap, throwError} from "rxjs";


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

  getUserName(token: string): Observable<string> {
    const headers = new HttpHeaders({ Authorization: `token ${token}` });
    return this.http.get<{login: string}>('https://api.github.com/user', { headers })
      .pipe(map(user => user.login));
  }

  listRepos(token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `token ${token}` });
    return this.getUserName(token).pipe(
      switchMap(userName =>
        this.http.get<any[]>('https://api.github.com/user/repos', { headers }).pipe(
          map((repos: any[]) => repos.filter(repo => !repo.private && repo.owner.login === userName)),
          catchError(error => {
            console.error('Error getting repos:', error);
            return throwError('Error getting repos');
          })
        )
      )
    );
  }
  async getLatestCommitSha(owner: string, repo: string): Promise<string> {
    const { data } = await this.octokit.repos.listCommits({
      owner,
      repo,
      per_page: 1
    });

    return data[0].sha;
  }
  getRepoInfo(owner: string, repo: string): Observable<any> {
    return this.http.get(`https://api.github.com/repos/${owner}/${repo}`);
  }
  cloneRepo(repoName: string): Observable<any> {
    return this.http.post(`http://localhost:4202/cloneRepo`, { repoName });
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

  async createFile(owner: string, repo: string, path: string, message: string, content: string, branch: string) {
    const { data } = await this.octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: btoa(content), // El contenido debe estar en formato base64
      branch
    });
    return data;
  }
}

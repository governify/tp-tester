import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Octokit } from '@octokit/rest';
import {catchError, map, Observable, switchMap, throwError} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private octokit: Octokit;
  private apiUrl = 'https://api.github.com';
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

  async createBranch(owner: string, repo: string, branchName: string, ref: string) {
    const { data } = await this.octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: ref
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

  createPullRequest(token: string, owner: string, repo: string, prTitle: string, prHead: string, prBase: string, prBody: string): Observable<any> {
    const url = `${this.apiUrl}/repos/${owner}/${repo}/pulls`;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json'
    };
    const data = { title: prTitle, head: prHead, base: prBase, body: prBody };

    return this.http.post(url, data, { headers });
  }

  getOpenPullRequests(token: string, owner: string, repo: string): Observable<any[]> {
    const url = `${this.apiUrl}/repos/${owner}/${repo}/pulls?state=open`;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json'
    };

    return this.http.get<any[]>(url, { headers });
  }

  mergePullRequest(token: string, owner: string, repo: string, mergePrNumber: number, mergeCommitMessage: string): Observable<any> {
    const url = `${this.apiUrl}/repos/${owner}/${repo}/pulls/${mergePrNumber}/merge`;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json'
    };
    const data = {commit_message: mergeCommitMessage};

    return this.http.put(url, data, {headers});
  }

  getBranches(token: string, owner: string, repo: string): Observable<any[]> {
    const url = `${this.apiUrl}/repos/${owner}/${repo}/branches`;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json'
    };

    return this.http.get<any[]>(url, { headers });
  }
}

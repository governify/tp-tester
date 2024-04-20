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

  getRepoInfo(owner: string, repo: string): Observable<any> {
    return this.http.get(`https://api.github.com/repos/${owner}/${repo}`);
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

  mergeLastOpenPullRequest(token: string, owner: string, repo: string, mergeCommitMessage: string): Observable<any> {
    return this.getOpenPullRequests(token, owner, repo).pipe(
      switchMap((pullRequests: any[]) => {
        if (pullRequests.length > 0) {
          const lastOpenPr = pullRequests[pullRequests.length - 1];
          const mergePrNumber = lastOpenPr.number;

          const url = `${this.apiUrl}/repos/${owner}/${repo}/pulls/${mergePrNumber}/merge`;
          const headers = {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json'
          };
          const data = {commit_message: mergeCommitMessage};

          return this.http.put(url, data, {headers});
        } else {
          throw new Error('No open pull requests found');
        }
      })
    );
  }

  getBranches(token: string, owner: string, repo: string): Observable<any[]> {
    const url = `${this.apiUrl}/repos/${owner}/${repo}/branches`;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json'
    };
    return this.http.get<any[]>(url, { headers });
  }

  // Método para obtener las issues de un repositorio
  getIssues(token: string, owner: string, repo: string): Observable<any[]> {
    const url = `${this.apiUrl}/repos/${owner}/${repo}/issues`;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json'
    };

    return this.http.get<any[]>(url, { headers });
  }

// Método para crear una issue en un repositorio
  createIssue(token: string, owner: string, repo: string, issue: {title: string, body: string}): Observable<any> {
    const url = `${this.apiUrl}/repos/${owner}/${repo}/issues`;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json'
    };

    return this.http.post(url, issue, { headers });
  }
}

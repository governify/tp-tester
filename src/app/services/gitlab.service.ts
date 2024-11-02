import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable, switchMap, throwError} from "rxjs";
import { JiraService } from './jira.service';

@Injectable({
  providedIn: 'root'
})
export class GitlabService {
  private apiUrl = 'https://gitlab.com/api/v4';
  constructor(private http: HttpClient, private jiraService: JiraService) {
  }
  listBranchesForRepo(owner: string, repo: string): Observable<any> {
    return this.http.get(`https://gitlab.com/api/v4/projects/${owner}%2F${repo}/repository/branches`);
  }

  getUserName(token: string): Observable<string> {
    const headers = new HttpHeaders({ "PRIVATE-TOKEN": `${token}` });
    return this.http.get<{username: string}>('https://gitlab.com/api/v4/user', { headers })
      .pipe(map(user => user.username));
  }

  listRepos(token: string): Observable<any> {
    const headers = new HttpHeaders({ "PRIVATE-TOKEN": `${token}` });
    return this.http.get<any[]>('https://gitlab.com/api/v4/projects?membership=yes', { headers }).pipe(
      map((repos: any[]) => repos.filter(repo => repo.visibility === "public")),
      catchError(error => {
        console.error('Error getting repos:', error);
        return throwError('Error getting repos');
      })
    );
  }

  getRepoInfo(owner: string, repo: string): Observable<any> {
    return this.http.get(`https://gitlab.com/api/v4/projects/${owner}%2F${repo}`);
  }

  createMergeRequest(token: string, owner: string, repo: string, mrTitle: string, mrSource: string, mrTarget: string, mrDesc: string): Observable<any> {
    const url = `${this.apiUrl}/projects/${owner}%2F${repo}/merge_requests`;
    const headers = { "PRIVATE-TOKEN": `${token}` };
    const data = { title: mrTitle, source_branch: mrSource, target_branch: mrTarget, description: mrDesc };

    return this.http.post(url, data, { headers });
  }

  createMergeRequestLastJiraIssue(jiraToken: string, domain: string, token: string, owner: string, repo: string, mrTitle: string, mrSource: string, mrTarget: string, mrDesc: string): Observable<any> {
    console.log('Por aqui');
    return this.jiraService.getIssues(jiraToken, domain).pipe(
      switchMap((jiraData: any[]) => {
        // @ts-ignore
        if (jiraData.issues && jiraData.issues.length > 0) {
          // @ts-ignore
          const lastIssue = jiraData.issues[0];
          const issueid = lastIssue.key;
          const url = `${this.apiUrl}/projects/${owner}%2F${repo}/merge_requests`;
          const headers = { "PRIVATE-TOKEN": `${token}` };
          const data = { title: mrTitle + ' /' + issueid, source_branch: mrSource, target_branch: mrTarget, description: mrDesc };

          return this.http.post(url, data, { headers });
        } else {
          throw new Error('No Jira issues found');
        }
      })
    );
  }

  getOpenMergeRequests(token: string, owner: string, repo: string): Observable<any[]> {
    const url = `${this.apiUrl}/projects/${owner}%2F${repo}/merge_requests?scope=all&state=opened`;
    const headers = { "PRIVATE-TOKEN": `${token}` };

    return this.http.get<any[]>(url, { headers });
  }

  mergeMergeRequest(token: string, owner: string, repo: string, mergeMrId: number, mergeCommitMessage: string): Observable<any> {
    const url = `${this.apiUrl}/projects/${owner}%2F${repo}/merge_requests/${mergeMrId}/merge`;
    const headers = { "PRIVATE-TOKEN": `${token}` };
    const data = {merge_commit_message: mergeCommitMessage};

    return this.http.put(url, data, {headers});
  }

  mergeLastOpenMergeRequest(token: string, owner: string, repo: string, mergeCommitMessage: string): Observable<any> {
    return this.getOpenMergeRequests(token, owner, repo).pipe(
      switchMap((mergeRequests: any[]) => {
        if (mergeRequests.length > 0) {
          const lastOpenMr = mergeRequests[0];
          const mergeMrId = lastOpenMr.iid;

          const url = `${this.apiUrl}/projects/${owner}%2F${repo}/merge_requests/${mergeMrId}/merge`;
          const headers = { "PRIVATE-TOKEN": `${token}` };
          const data = {merge_commit_message: mergeCommitMessage};

          return this.http.put(url, data, {headers});
        } else {
          throw new Error('No open merge requests found');
        }
      })
    );
  }

  closeLastOpenMergeRequest(token: string, owner: string, repo: string): Observable<any> {
    return this.getOpenMergeRequests(token, owner, repo).pipe(
      switchMap((mergeRequests: any[]) => {
        if (mergeRequests.length > 0) {
          const lastOpenMr = mergeRequests[0];
          const mergeMrId = lastOpenMr.iid;

          const url = `${this.apiUrl}/projects/${owner}%2F${repo}/merge_requests/${mergeMrId}?state_event=close`;
          const headers = { "PRIVATE-TOKEN": `${token}` };

          return this.http.put(url, null, {headers});
        } else {
          throw new Error('No open merge requests found');
        }
      })
    );
  }

  createBranch(token: string, owner: string, repo: string, brName: string, brSource: string): Observable<any> {
    const url = `${this.apiUrl}/projects/${owner}%2F${repo}/repository/branches?branch=${brName}&ref=${brSource}`;
    const headers = { "PRIVATE-TOKEN": `${token}` };

    return this.http.post(url, null, { headers });
  }

  createFile(token: string, owner: string, repo: string, fileName: string, file: {branch: string, content: string, commit_message: string}): Observable<any> {
    const url = `${this.apiUrl}/projects/${owner}%2F${repo}/repository/files/${fileName}`;
    const headers = { "PRIVATE-TOKEN": `${token}` };

    return this.http.post(url, file, { headers });
  }

  deleteFile(token: string, owner: string, repo: string, fileName: string, file: {branch: string, commit_message: string}): Observable<any> {
    const url = `${this.apiUrl}/projects/${owner}%2F${repo}/repository/files/${fileName}`;
    const headers = { "PRIVATE-TOKEN": `${token}` };

    return this.http.delete(url, { headers: headers, body: file });
  }

  deleteBranch(token: string, owner: string, repo: string, brName: string): Observable<any> {
    const url = `${this.apiUrl}/projects/${owner}%2F${repo}/repository/branches/${brName}`;
    const headers = { "PRIVATE-TOKEN": `${token}` };

    return this.http.delete(url, { headers });
  }

  /*getBranches(token: string, owner: string, repo: string): Observable<any[]> {
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
  }*/
}

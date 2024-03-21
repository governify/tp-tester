import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlassmatrixService {
  private url = 'http://localhost:6012/glassmatrix/api/v1';
  constructor(private http: HttpClient) { }

  saveToJson(fileName: string, data: any): Observable<any> {
    return this.http.post(`${this.url}/tpa/save`, { fileName: fileName, content: data });
  }

  deleteFile(fileName: string): Observable<any> {
    return this.http.delete(`${this.url}/tpa/files/${fileName}`);
  }

  loadFiles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/tpa/files`);
  }

  updateFile(fileName: string, data: any): Observable<any> {
    return this.http.post(`${this.url}/tpa/update`, { fileName: fileName, content: data });
  }

  //TOKENS DE GITHUB
  getToken(): Observable<{ token: string }> {
    return this.http.get<{ token: string }>(`${this.url}/github/token/get`);
  }

  saveToken(token: string): Observable<any> {
    return this.http.post(`${this.url}/github/token/save`, { token: token });
  }

  deleteToken(): Observable<any> {
    return this.http.delete(`${this.url}/github/token/delete`);
  }

  // GITHUB LOCAL ACTIONS
  cloneRepo(owner: string, repoName: string): Observable<any> {
    return this.http.post(`${this.url}/github/cloneRepo`, { owner, repoName });
  }

  listRepos(): Observable<any> {
    return this.http.get<any>(`${this.url}/github/listRepos`);
  }

  deleteRepo(repo: string): Observable<any> {
    return this.http.delete(`${this.url}/github/deleteRepo/${repo}`);
  }

  //GITHUB BRANCHES

  getBranches(repoName: string): Observable<any> {
    return this.http.get<any>(`${this.url}/github/branches/${repoName}`);
  }

  createBranch(repoName: string, branchFormValue: any): Observable<any> {
    return this.http.post<any>(`${this.url}/github/createBranch/${repoName}`, branchFormValue);
  }

  deleteBranch(repoName: string, selectedBranch: string): Observable<any> {
    return this.http.delete(`${this.url}/github/deleteBranch/${repoName}/${selectedBranch}`);
  }

  pullCurrentBranch(repoName: string): Observable<any> {
    return this.http.get(`${this.url}/github/pullCurrentBranch/${repoName}`);
  }

  changeBranch(repoName: string, branchToChangeTo: string): Observable<any> {
    return this.http.post(`${this.url}/github/changeBranch/${repoName}/${branchToChangeTo}`, {});
  }

  getFiles(repoName: string): Observable<{ files: string[] }> {
    return this.http.get<{ files: string[] }>(`${this.url}/github/files/${repoName}`);
  }

  createFile(repoName: string, fileName: string, fileContent: string): Observable<any> {
    return this.http.post(`${this.url}/github/createFile/${repoName}`, { fileName, fileContent });
  }

  pushChanges(repoName: string): Observable<any> {
    return this.http.post(`${this.url}/github/push/${repoName}`, {});
  }

  createCommit(repoName: string, fileContent: string, commitMessage: string): Observable<any> {
    return this.http.post(`${this.url}/github/commit/${repoName}`, { fileContent, commitMessage });
  }
}

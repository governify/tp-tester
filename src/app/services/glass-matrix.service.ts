import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, Subject, map, catchError } from 'rxjs';
import { BASE_URL} from "../../../lockedConfig";

@Injectable({
  providedIn: 'root'
})
export class GlassmatrixService {
  private url = `${BASE_URL}:6012/glassmatrix/api/v1`;
  public getBackendEnabled = new Subject<boolean>();
  constructor(private http: HttpClient) { }

  checkBackendEnabled(): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${this.getKey()}` });
    console.log('Entrando aqui');
    return this.http.get<HttpResponse<any>>(`${this.url}/checkAccessKey`, { headers, observe: 'response' }).pipe(
      map((data: HttpResponse<any>) => {
        if (data.status === 204) {
          this.getBackendEnabled.next(true);
          return of(true);
        } else {
          this.getBackendEnabled.next(false);
          return of(false);
        }
      }),
      catchError(err => {
        this.getBackendEnabled.next(false);
        return of(false);
      })
    );
  }

  getKey(): string {
    const foundKey = localStorage.getItem('access-key');
    if (!foundKey || foundKey === '') {
        return 'Key not found';
    } else {
        return foundKey;
    }
  }

  saveKey(newKey: string): void {
    localStorage.setItem('access-key', newKey);
    this.checkBackendEnabled().subscribe();
  }

  updateKey(newKey: string): void {
    localStorage.setItem('access-key', newKey);
    this.checkBackendEnabled().subscribe();
  }

  saveToJson(fileName: string, data: any): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.post(`${this.url}/tpa/save`, { fileName: fileName, content: data }, { headers });
  }
  saveTPAMetricToJson(fileName: string, folderName: string, data: any): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.post(`${this.url}/tpa/saveTPAMetric`, { fileName: fileName, folderName: folderName, content: data }, { headers });
  }
  deleteFile(fileName: string): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.delete(`${this.url}/tpa/files/${fileName}`, { headers });
  }
  deleteTPAFile(subdirectory: string, fileName: string): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.delete(`${this.url}/tpa/files/tpaFile/${subdirectory}/${fileName}`, { headers });
  }
  loadTPAFiles(): Observable<string[]> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.get<string[]>(`${this.url}/tpa/TPAfiles`, { headers });
  }
  loadIndividualFiles(): Observable<string[]> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.get<string[]>(`${this.url}/tpa/indifivualFiles`, { headers });
  }
  updateFile(fileName: string, data: any): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.post(`${this.url}/tpa/update`, { fileName: fileName, content: data }, { headers });
  }
  updateTPAFile(folderName: string, fileName: string, data: any): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.post(`${this.url}/tpa/updateTPAMetric`, { folderName: folderName, fileName: fileName, content: data }, { headers });
  }
  loadFolders(): Observable<string[]> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.get<string[]>(`${this.url}/tpa/loadFolders`, { headers });
  }

  loadSubdirectoryFiles(subdirectory: string): Observable<string[]> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.get<string[]>(`${this.url}/tpa/loadFolders/${subdirectory}`, { headers });
  }

  loadFileContent(subdirectory: string, file: string): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.get<any>(`${this.url}/tpa/loadFolders/${subdirectory}/${file}`, { headers });
  }
  //TOKENS DE GITHUB
  getToken(): Observable<{ token: string[] }> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.get<{ token: string[] }>(`${this.url}/github/token/get`, { headers });
  }

  saveToken(token: string[]): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.post(`${this.url}/github/token/save`, { token: token }, { headers });
  }

  deleteToken(): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.delete(`${this.url}/github/token/delete`, { headers });
  }
  //TOKENS DE GITLAB
  getGLToken(): Observable<{ token: string[] }> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.get<{ token: string[] }>(`${this.url}/gitlab/token/get`, { headers });
  }

  saveGLToken(token: string[]): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.post(`${this.url}/gitlab/token/save`, { token: token }, { headers });
  }

  deleteGLToken(): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.delete(`${this.url}/gitlab/token/delete`, { headers });
  }
  //TOKENS DE JIRA
  getJiraToken(): Observable<{ token: string[] }> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.get<{ token: string[] }>(`${this.url}/jira/token/get`, { headers });
  }

  saveJiraToken(token: string[]): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.post(`${this.url}/jira/token/save`, { token: token }, { headers });
  }

  deleteJiraToken(): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.delete(`${this.url}/jira/token/delete`, { headers });
  }

  // GITHUB LOCAL ACTIONS
  cloneRepo(owner: string, repoName: string): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.post(`${this.url}/github/cloneRepo`, { owner, repoName }, { headers });
  }

  cloneGLRepo(owner: string, repoName: string): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.post(`${this.url}/gitlab/cloneRepo`, { owner, repoName }, { headers });
  }

  listRepos(): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.get<any>(`${this.url}/github/listRepos`, { headers });
  }

  deleteRepo(repo: string): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.delete(`${this.url}/github/deleteRepo/${repo}`, { headers });
  }

  //GITHUB BRANCHES

  getBranches(repoName: string): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.get<any>(`${this.url}/github/branches/${repoName}`, { headers });
  }

  createBranch(repoName: string, branchFormValue: any): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.post<any>(`${this.url}/github/createBranch/${repoName}`, branchFormValue, { headers });
  }

  deleteBranch(repoName: string, selectedBranch: string): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.delete(`${this.url}/github/deleteBranch/${repoName}/${selectedBranch}`, { headers });
  }

  pullCurrentBranch(repoName: string): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.get(`${this.url}/github/pullCurrentBranch/${repoName}`, { headers });
  }

  changeBranch(repoName: string, branchToChangeTo: string): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.post(`${this.url}/github/changeBranch/${repoName}/${branchToChangeTo}`, {}, { headers });
  }

  getFiles(repoName: string): Observable<{ files: string[] }> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.get<{ files: string[] }>(`${this.url}/github/files/${repoName}`, { headers });
  }

  createFile(repoName: string, fileName: string, fileContent: string): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.post(`${this.url}/github/createFile/${repoName}`, { fileName, fileContent }, { headers });
  }

  deleteGithubFile(repoName: string, fileName: string): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.delete(`${this.url}/github/deleteFile/${repoName}/${fileName}`, { headers });
  }

  pushChanges(repoName: string): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.post(`${this.url}/github/push/${repoName}`, {}, { headers });
  }

  createCommit(repoName: string, fileContent: string, commitMessage: string): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.post(`${this.url}/github/commit/${repoName}`, { fileContent, commitMessage }, { headers });
  }

  commitAllChanges(repoName: string, commitMessage: string): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.post(`${this.url}/github/commitAll/${repoName}`, { commitMessage }, { headers });
  }

  // GITLAB ACTIONS
  listGLRepos(): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.get<any>(`${this.url}/gitlab/listRepos`, { headers });
  }

  // ARCHIVOS YAML
  saveYAMLFile(fileName: string, content: string): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.post(`${this.url}/tests/saveYAMLFile`, { fileName, content }, { headers });
  }

  getAllYAMLFiles(): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.get(`${this.url}/tests/getAllYAMLFiles`, { headers });
  }

  loadYAMLFile(fileName: string): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.get(`${this.url}/tests/loadYAMLFile/` + fileName, { headers });
  }

  updateYAMLFile(fileName: string, newContent: string): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.put(`${this.url}/tests/updateYAMLFile/` + fileName, { content: newContent }, { headers });
  }

  deleteYAMLFile(fileName: string): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.delete(`${this.url}/tests/deleteYAMLFile/` + fileName, { headers });
  }
  calculateSHA(data: any): Observable<any> {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    return this.http.post(`${this.url}/calculateSHA`, data, { headers });
  }

}

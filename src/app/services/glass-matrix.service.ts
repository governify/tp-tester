import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL} from "../../../lockedConfig";

@Injectable({
  providedIn: 'root'
})
export class GlassmatrixService {
  private url = `${BASE_URL}:6012/glassmatrix/api/v1`;
  constructor(private http: HttpClient) { }

  saveToJson(fileName: string, data: any): Observable<any> {
    return this.http.post(`${this.url}/tpa/save`, { fileName: fileName, content: data });
  }
  saveTPAMetricToJson(fileName: string, folderName: string, data: any): Observable<any> {
    return this.http.post(`${this.url}/tpa/saveTPAMetric`, { fileName: fileName, folderName: folderName, content: data });
  }
  deleteFile(fileName: string): Observable<any> {
    return this.http.delete(`${this.url}/tpa/files/${fileName}`);
  }
  deleteTPAFile(subdirectory: string, fileName: string): Observable<any> {
    return this.http.delete(`${this.url}/tpa/files/tpaFile/${subdirectory}/${fileName}`);
  }
  loadTPAFiles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/tpa/TPAfiles`);
  }
  loadIndividualFiles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/tpa/indifivualFiles`);
  }
  updateFile(fileName: string, data: any): Observable<any> {
    return this.http.post(`${this.url}/tpa/update`, { fileName: fileName, content: data });
  }
  updateTPAFile(folderName: string, fileName: string, data: any): Observable<any> {
    return this.http.post(`${this.url}/tpa/updateTPAMetric`, { folderName: folderName, fileName: fileName, content: data });
  }
  loadFolders(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/tpa/loadFolders`);
  }

  loadSubdirectoryFiles(subdirectory: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/tpa/loadFolders/${subdirectory}`);
  }

  loadFileContent(subdirectory: string, file: string): Observable<any> {
    return this.http.get<any>(`${this.url}/tpa/loadFolders/${subdirectory}/${file}`);
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

  commitAllChanges(repoName: string, commitMessage: string): Observable<any> {
    return this.http.post(`${this.url}/github/commitAll/${repoName}`, { commitMessage });
  }

  // ARCHIVOS YAML
  saveYAMLFile(fileName: string, content: string): Observable<any> {
    return this.http.post(`${this.url}/tests/saveYAMLFile`, { fileName, content });
  }

  getAllYAMLFiles(): Observable<any> {
    return this.http.get(`${this.url}/tests/getAllYAMLFiles`);
  }

  loadYAMLFile(fileName: string): Observable<any> {
    return this.http.get(`${this.url}/tests/loadYAMLFile/` + fileName);
  }

  updateYAMLFile(fileName: string, newContent: string): Observable<any> {
    return this.http.put(`${this.url}/tests/updateYAMLFile/` + fileName, { content: newContent });
  }

  deleteYAMLFile(fileName: string): Observable<any> {
    return this.http.delete(`${this.url}/tests/deleteYAMLFile/` + fileName);
  }
}

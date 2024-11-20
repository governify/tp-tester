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
    return this.http.get(`${this.apiUrl}/repos/${owner}/${repo}/branches`);
  }

  getUserName(token: string): Observable<string> {
    const headers = new HttpHeaders({ Authorization: `token ${token}` });
    return this.http.get<{login: string}>(`${this.apiUrl}/user`, { headers })
      .pipe(map(user => user.login));
  }

  listRepos(token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `token ${token}` });
    return this.getUserName(token).pipe(
      switchMap(userName =>
        this.http.get<any[]>(`${this.apiUrl}/user/repos`, { headers }).pipe(
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
    return this.http.get(`${this.apiUrl}/repos/${owner}/${repo}`);
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
  undoLastMergedPullRequest(token: string, owner: string, repo: string): Observable<any> {
    const url = `${this.apiUrl}/repos/${owner}/${repo}/pulls?state=closed`;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json'
    };

    return this.http.get<any[]>(url, { headers }).pipe(
      switchMap((pullRequests: any[]) => {
        const lastMergedPr = pullRequests.find(pr => pr.merged_at !== null);
        if (lastMergedPr) {
          const revertBranchName = `revert-${lastMergedPr.number}`;
          const revertCommitMessage = `Revert "Merge pull request #${lastMergedPr.number}"`;

          return this.octokit.git.createRef({
            owner,
            repo,
            ref: `refs/heads/${revertBranchName}`,
            sha: lastMergedPr.merge_commit_sha
          }).then(() => {
            return this.createPullRequest(token, owner, repo, revertCommitMessage, revertBranchName, 'main', '');
          });
        } else {
          throw new Error('No merged pull requests found');
        }
      })
    );
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

  createBranch(token: string, owner: string, repo: string, branchName: string, baseBranch: string): Observable<any> {
    return this.getBranches(token, owner, repo).pipe(
      switchMap((branches: any[]) => {
        if (branches.length > 0) {
          const foundBranch = branches.find(brnch => brnch.name === baseBranch);
          if (!foundBranch) throw new Error('Base branch not found');

          const url = `${this.apiUrl}/repos/${owner}/${repo}/git/refs`;
          const headers = {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json'
          };
          const data = {ref: `refs/heads/${branchName}`, sha: foundBranch.commit.sha};

          return this.http.post(url, data, {headers});
        } else {
          throw new Error('No branches found');
        }
      })
    );
  }

  createFile(token: string, owner: string, repo: string, fileName: string, file: {message: string, content: string, branch: string}): Observable<any> {
    const url = `${this.apiUrl}/repos/${owner}/${repo}/contents/${fileName}`;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json'
    };

    return this.http.put(url, file, { headers });
  }

  getFile(token: string, owner: string, repo: string, fileName: string, branch: string): Observable<any> {
    const url = `${this.apiUrl}/repos/${owner}/${repo}/contents/${fileName}?ref=${branch}`;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json'
    };

    return this.http.get(url, { headers });
  }

  deleteFile(token: string, owner: string, repo: string, fileName: string, file: {message: string, branch: string}): Observable<any> {
    return this.getFile(token, owner, repo, fileName, file.branch).pipe(
      switchMap((foundFile: any) => {
        if (!foundFile) throw new Error('File not found');
        const url = `${this.apiUrl}/repos/${owner}/${repo}/contents/${fileName}`;
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github+json'
        };

        return this.http.delete(url, { headers: headers, body: {message: file.message, sha: foundFile.sha, branch: file.branch} });
      })
    );
  }

  deleteBranch(token: string, owner: string, repo: string, branchName: string): Observable<any[]> {
    const url = `${this.apiUrl}/repos/${owner}/${repo}/git/refs/heads/${branchName}`;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json'
    };
    return this.http.delete<any[]>(url, { headers });
  }

  getProjectV2Data(token: string, owner: string, repo: string): Observable<any> {
    const url = `${this.apiUrl}/graphql`;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.starfox-preview+json'
    };
    const data = {
      query: `query {
                  repository(owner: "${owner}", name: "${repo}") {
                    id
                    projectsV2(first: 1) {
                      nodes {
                        id
                      }
                    }
                  }
                }
              }`
    };
    return this.http.post(url, data, { headers });
  }

  createIssueProject(token: string, owner: string, repo: string, issue: {title: string, body: string}): Observable<any> {
    return this.getProjectV2Data(token, owner, repo).pipe(
      switchMap((repoData: any) => {
        const repoId = repoData.data?.repository?.id;
        if (!repoId) throw new Error('Repo not found');
        console.log(repoData);
        const projectId = repoData.data.repository.projectsV2?.nodes[0]?.id;
        if (!projectId) throw new Error('Project not found');
        const url = `${this.apiUrl}/graphql`;
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.starfox-preview+json'
        };
        const data = {
          query: `mutation {
                    createIssue(input: { repositoryId: "${repoId}", title: "${issue.title}", body: "${issue.body}" }) {
                      issue {
                        id
                      }
                    }
                  }`
        };
        return this.http.post(url, data, { headers }).pipe(
          switchMap((issueData: any) => {
            const issueId = issueData.data?.createIssue?.issue?.id;
            const data2 = {
              query: `mutation {
                        addProjectV2ItemById(input: { projectId: "${projectId}", contentId: "${issueId}" }) {
                          item {
                            id
                          }
                        }
                      }`
            };
            return this.http.post(url, data2, { headers })
          })
        );
      })
    )
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Component, OnInit} from "@angular/core";
import {GlassmatrixService} from "../../services/glass-matrix.service";
import * as yaml from 'json-to-pretty-yaml';
import { BASE_URL } from "../../../../lockedConfig";
import { COLLECTOR_EVENTS_URL } from '../../../../lockedConfig';
import {GithubService} from "../../services/github.service";
import {GitlabService} from "../../services/gitlab.service";
import {JiraService} from '../../services/jira.service';
import {BluejayService} from "../../services/bluejay.service";
import {catchError, Observable, tap, throwError} from "rxjs";
import {FilesService} from "../../services/files.service";
import { FixedwindowhelpComponent } from 'src/app/components/dialogs/fixedwindowhelp/fixedwindowhelp.component';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ViewportScroller} from "@angular/common";

interface Step {
  method: string;
  uses: string;
  with: {
    [key: string]: string;
  };
}
interface Config {
  useFixedWindow: boolean;
}
interface Response {
  data: any;
}
interface YamlData {
  config: Config;
  steps: Step[];
}
@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {
  yamlContent!: string;
  yamlFiles: string[] = [];
  isLoading = false;
  fileName2!: string;
  fileName!: string;
  response!: any;
  tpa!: string;
  token!: string[];
  gltoken!: string[];
  jiratoken!: string[];
  fixedWindow: boolean = false;
  tokenIndex: number = 0;
  errorMessage: string = '';
  saveStatusMessage: string = '';
  computationUrl: string | null = null;
  data!: string;
  filename!: string;
  computationResponse!: any;
  testStatuses: { text: string, success: boolean }[] = [];
  scope = {
    project: '',
    class: '',
    member: ''
  };

  window = {
    type: '',
    period: '',
    initial: '',
    from: '',
    end: '',
    timeZone: ''
  };
  variables = {};
  constructor(
    private http: HttpClient,
    private glassmatrixService: GlassmatrixService,
    private githubService: GithubService,
    private gitlabService: GitlabService,
    private jiraService: JiraService,
    private bluejayService: BluejayService,
    private filesService: FilesService,
    private dialog: MatDialog,
    private viewportScroller: ViewportScroller
  ) { this.computationResponse = ''; }

  ngOnInit(): void {
    this.loadYamlFiles();
    this.getToken();
    this.getGLToken();
    this.getJiraToken();
  }

  getToken(): void {
    this.glassmatrixService.getToken().subscribe(
      response => {
        this.token = response.token;
      },
      () => this.token = ['Token not found']
    );
  }

  getGLToken(): void {
    this.glassmatrixService.getGLToken().subscribe(
      response => {
        this.gltoken = response.token;
      },
      () => this.gltoken = ['Token not found']
    );
  }

  getJiraToken(): void {
    this.glassmatrixService.getJiraToken().subscribe(
      response => {
        this.jiratoken = response.token;
      },
      () => this.jiratoken = ['Token not found']
    );
  }

  loadYamlFiles() {
    this.glassmatrixService.getAllYAMLFiles().subscribe(files => {
      this.yamlFiles = files;
    });
  }

  saveYaml() {
    this.glassmatrixService.saveYAMLFile(this.fileName, this.yamlContent).subscribe(() => {
      this.saveStatusMessage = 'El archivo se ha guardado correctamente.';
      this.loadYamlFiles();
    });
  }

  deleteYamlFile(fileName: string) {
    this.glassmatrixService.deleteYAMLFile(fileName).subscribe(() => {
      this.loadYamlFiles();
    });
  }

  loadFileContent(fileName: string) {
    this.glassmatrixService.loadYAMLFile(fileName).subscribe(content => {
      this.yamlContent = yaml.stringify(content);
    });
  }
  private stepHandlers = {
    'TEST': {
      'bluejay/check': (step: {
        with: {
          key: string,
          conditions: { minExpectedValue?: string, maxExpectedValue?: string, expectedValue?: string }
        }[];
        value?: string,
        type?: string,
        createdAt?: string,
        authorLogin?: string
      }) => {
        let testSuccess = false;
        return Promise.all(step.with.map(({key, conditions}) => {
          return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
              const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
              this.http.get<any>(`${BASE_URL}/glassmatrix/api/v1/getData/${key}`, { headers }).subscribe((data: any) => {
                if (data) {
                  let tempTestStatuses: { text: string, success: boolean }[] = [];
                  data.forEach((item: any) => {
                    // Si 'value' no está definido en el paso, o si es igual al 'value' en el objeto de datos, entonces procesa el objeto
                    if (item[key] && (step.value === undefined || item['value'] == step.value)) {
                      const value = item[key];
                      // Comprueba si el valor de la clave es "not found"
                      if (value === "not found") {
                        tempTestStatuses.push({
                          text: `Test failed. Field '${key}' not found in the database`,
                          success: false
                        });
                      } else {
                        // Comprueba cada condición por separado
                        if (conditions.minExpectedValue !== undefined) {
                          if (value >= Number(conditions.minExpectedValue)) {
                            tempTestStatuses.push({
                              text: `Test successfully completed.\nCondition: minExpectedValue=${conditions.minExpectedValue}\nResult: ${key}=${value}`,
                              success: true
                            });
                            testSuccess = true;
                          } else {
                            tempTestStatuses.push({
                              text: `Test failed.\nCondition: minExpectedValue=${conditions.minExpectedValue}\nResult: ${key}=${value}`,
                              success: false
                            });
                          }
                        }
                        if (conditions.maxExpectedValue !== undefined) {
                          if (value <= Number(conditions.maxExpectedValue)) {
                            tempTestStatuses.push({
                              text: `Test successfully completed.\nCondition: maxExpectedValue=${conditions.maxExpectedValue}\nResult: ${key}=${value}`,
                              success: true
                            });
                            testSuccess = true;
                          } else {
                            tempTestStatuses.push({
                              text: `Test failed.\nCondition: maxExpectedValue=${conditions.maxExpectedValue}\nResult: ${key}=${value}`,
                              success: false
                            });
                          }
                        }
                        if (conditions.expectedValue !== undefined) {
                          if (value === conditions.expectedValue) {
                            tempTestStatuses.push({
                              text: `Test successfully completed.\nCondition: expectedValue=${conditions.expectedValue}\nResult: ${key}=${value}`,
                              success: true
                            });
                            testSuccess = true;
                          } else {
                            tempTestStatuses.push({
                              text: `Test failed.\nCondition: expectedValue=${conditions.expectedValue}\nResult: ${key}=${value}`,
                              success: false
                            });
                          }
                        }
                      }
                    }
                  });
                  if (step.type === 'OR' && testSuccess) tempTestStatuses = tempTestStatuses.filter(stts => stts.success === true);
                  this.testStatuses.push(...tempTestStatuses);
                  resolve();
                } else {
                  // Si no hay datos, empuja un mensaje indicando que el test ha fallado a this.testStatuses
                  this.testStatuses.push({
                    text: `Test failed. Field '${key}' not found in the database`,
                    success: false
                  });
                  resolve();
                }
              }, reject);
            }, 10000);
          });
        }));
      },
      'bluejay/findCheck': (step: { with: { values: any[]; }; }) => {
        return new Promise(resolve => setTimeout(resolve, 1000))
          .then(() => {
            const url = `${BASE_URL}/glassmatrix/api/v1/bluejay/findCheck`;
            const headers = {'Authorization': `Bearer ${this.token[this.tokenIndex]}`};

            return this.http.post(url, {values: step.with.values}, {headers}).toPromise().then((response: any) => {
              // Agrega la respuesta a la respuesta existe
              this.response += 'bluejay/findCheck ' + JSON.stringify(response, null, 2) + '\n\n';

              // Comprueba si se encontraron los valores esperados y agrega los resultados a testStatuses
              step.with.values.forEach((valueObj: any) => {
                const foundValue = response.find((res: any) =>
                  res.computations.some((comp: any) =>
                    comp.value === valueObj.value &&
                    comp.evidences.some((evidence: any) => {
                      let allEvidencesFound = true;
                      for (const key in valueObj.evidences) {
                        if (key === 'login') {
                          const foundLogin = evidence.author.login === valueObj.evidences.login;
                          allEvidencesFound = allEvidencesFound && foundLogin;
                          if (foundLogin) {
                            this.testStatuses.push({
                              text: `Test successfully completed. login = "${valueObj.evidences.login}" found.`,
                              success: true
                            });
                          } else {
                            this.testStatuses.push({
                              text: `Test failed. login = "${valueObj.evidences.login}" not found.`,
                              success: false
                            });
                          }
                        } else if (key === 'bodyText') {
                          const foundBodyText = evidence.comments.nodes.some((comment: any) => comment.bodyText === valueObj.evidences.bodyText);
                          allEvidencesFound = allEvidencesFound && foundBodyText;
                          if (foundBodyText) {
                            this.testStatuses.push({
                              text: `Test successfully completed. bodyText = "${valueObj.evidences.bodyText}" found.`,
                              success: true
                            });
                          } else {
                            this.testStatuses.push({
                              text: `Test failed. bodyText = "${valueObj.evidences.bodyText}" not found.`,
                              success: false
                            });
                          }
                        } else {
                          const foundEvidence = evidence[key] === valueObj.evidences[key];
                          allEvidencesFound = allEvidencesFound && foundEvidence;
                          if (foundEvidence) {
                            this.testStatuses.push({
                              text: `Test successfully completed. ${key} = "${valueObj.evidences[key]}" found.`,
                              success: true
                            });
                          } else {
                            this.testStatuses.push({
                              text: `Test failed. ${key} = "${valueObj.evidences[key]}" not found.`,
                              success: false
                            });
                          }
                        }
                      }
                      return allEvidencesFound;
                    })
                  )
                );
                if (!foundValue) {
                  this.testStatuses.push({
                    text: `Test failed. Test for value: ${valueObj.value} has failed.`,
                    success: false
                  });
                }
              });
            });
          });
      },
    },
    'GET': {
      'github/getIssue': (step: { with: { [x: string]: string; }; }) => this.githubService.getIssues(this.token[this.tokenIndex], step.with['owner'], step.with['repoName']).toPromise(),
      'github/getOpenPR': (step: { with: { [x: string]: string; }; }) => this.githubService.getOpenPullRequests(this.token[this.tokenIndex], step.with['owner'], step.with['repoName']).toPromise(),
      'github/pullCurrentBranch': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.pullCurrentBranch(step.with['repoName']).toPromise(),
      'github/listRepos': () => this.glassmatrixService.listRepos().toPromise(),
      'github/getBranches': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.getBranches(step.with['repoName']).toPromise(),
      'github/getBranchesAPI': (step: { with: { [x: string]: string; }; }) => this.githubService.getBranches(this.gltoken[this.tokenIndex], step.with['owner'], step.with['repoName']).toPromise(),
      'github/getRepoInfo': (step: { with: { [x: string]: string; }; }) => this.githubService.getRepoInfo(step.with['repoName'], step.with['branchName']).toPromise(),
      'gitlab/getOpenMR': (step: { with: { [x: string]: string; }; }) => this.gitlabService.getOpenMergeRequests(this.gltoken[this.tokenIndex], step.with['owner'], step.with['repoName']).toPromise(),
      'gitlab/pullCurrentBranch': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.pullCurrentBranch(step.with['repoName']).toPromise(),
      'gitlab/listRepos': () => this.glassmatrixService.listRepos().toPromise(),
      'gitlab/getBranches': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.getBranches(step.with['repoName']).toPromise(),
      'gitlab/getRepoInfo': (step: { with: { [x: string]: string; }; }) => this.gitlabService.getRepoInfo(step.with['owner'], step.with['repoName']).toPromise(),
      'jira/getIssues': (step: { with: { [x: string]: string; }; }) => this.jiraService.getIssues(this.jiratoken[this.tokenIndex], step.with['domain']).toPromise()
    },
    'POST': {
      'github/mergeLastOpenPR': (step: { with: { [x: string]: string; }; }) => {
        return this.githubService.mergeLastOpenPullRequest(this.token[this.tokenIndex], step.with['owner'], step.with['repoName'], step.with['mergeMessage']).toPromise();
      },
      'github/undoLastMergedPR': (step: { with: { [x: string]: string; }; }) => {
        return this.githubService.undoLastMergedPullRequest(this.token[this.tokenIndex], step.with['owner'], step.with['repoName']).toPromise();
      },
      'bluejay/compute/tpa': (step: { with: { [x: string]: string; }; }) => {
        const tpa = step.with['tpa'];
        const metric = step.with['metric'];
        const time = step.with['actualTime'] === 'true';
        return this.loadData(tpa, metric, time).toPromise().then((data) => {
          this.postContent().subscribe(response => {
            setTimeout(() => {
              this.getComputation();
            }, 1000);
          });
        });
      },
      'bluejay/compute/metric': (step: { with: { [x: string]: string; }; }) => {
        const metric = step.with['metric'];
        const time = step.with['actualTime'] === 'true';
        return new Promise<void>((resolve, reject) => {
          this.loadIndividualData(metric, time).subscribe(
            () => {
              this.postContent().subscribe(response => {
                setTimeout(() => {
                  this.getComputation();
                }, 1000);
                resolve();
              }, reject);
            },
            reject
          );
        });
      },
      //DEPRECADO
      'bluejay/checkContain': (step: { with: { [x: string]: string; }; }) => {
        console.warn("Deprecation Warning: 'bluejay/checkContain' has been deprecated. Please use 'TEST' method with 'bluejay/check' instead.");
        const key = step.with['key'];
        const minExpectedValue = Number(step.with['minExpectedValue']);
        return new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            this.http.get<any>(`http://localhost:6012/glassmatrix/api/v1/getData/${key}`, {}).subscribe((data: any) => {
              this.testStatuses.push({ text: `Deprecation Warning: 'bluejay/checkContain' has been deprecated. Please use 'TEST' method with 'bluejay/check' instead.`, success: false });
              if (data && data[0] && data[0][key]) {
                const value = data[0][key];
                if (value >= minExpectedValue) {
                  this.testStatuses.push({ text: `Test successfully completed. ${key}=${value}`, success: true });
                  resolve();
                } else {
                  this.testStatuses.push({ text: `Test failed. ${key}=${value}`, success: false });
                  resolve();
                }
              } else {
                this.testStatuses.push({ text: `No records found for the field '${key}' in the database`, success: false });
                resolve();
              }
            }, reject);
          }, 10000);
        });
      },
      'github/createIssue': (step: { with: { [x: string]: string; }; }) => {
        const issue = { title: step.with['title'], body: step.with['body'] };
        return this.githubService.createIssue(this.token[this.tokenIndex], step.with['owner'], step.with['repoName'], issue).toPromise();
      },
      'github/createIssueProject': (step: { with: { [x: string]: string; }; }) => {
        const issue = { title: step.with['title'], body: step.with['body'] };
        return this.githubService.createIssueProject(this.token[this.tokenIndex], step.with['owner'], step.with['repoName'], issue).toPromise();
      },
      'github/createPR': (step: { with: { [x: string]: string; }; }) => {
        const pr = { title: step.with['title'], head: step.with['head'], base: step.with['base'], body: step.with['body'] };
        return this.githubService.createPullRequest(this.token[this.tokenIndex], step.with['owner'], step.with['repoName'], pr.title, pr.head, pr.base, pr.body).toPromise();
      },
      'github/cloneRepo': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.cloneRepo(step.with['owner'], step.with['repoName']).toPromise(),
      'github/createBranch': (step: { with: { [x: string]: string; }; }) => {
        const branchFormValue = { branchName: step.with['branchName'] };
        return this.glassmatrixService.createBranch(step.with['repoName'], branchFormValue).toPromise();
      },
      'github/createBranchAPI': (step: { with: { [x: string]: string; }; }) => this.githubService.createBranch(this.token[this.tokenIndex], step.with['owner'], step.with['repoName'], step.with['branchName'], step.with['baseBranch']).toPromise(),
      'github/createFile': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.createFile(step.with['repoName'], step.with['fileName'], step.with['fileContent']).toPromise(),
      'github/createFileAPI': (step: { with: { [x: string]: string; }; }) => {
        const file = { message: step.with['commitMessage'], content: btoa(step.with['fileContent']), branch: step.with['branch'] };
        return this.githubService.createFile(this.token[this.tokenIndex], step.with['owner'], step.with['repoName'], step.with['fileName'], file).toPromise();
      },
      'github/createCommit': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.createCommit(step.with['repoName'], step.with['fileContent'], step.with['commitMessage']).toPromise(),
      'github/commitAllChanges': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.commitAllChanges(step.with['repoName'], step.with['commitMessage']).toPromise(),
      'github/pushChanges': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.pushChanges(step.with['repoName']).toPromise(),
      'gitlab/cloneRepo': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.cloneGLRepo(step.with['owner'], step.with['repoName']).toPromise(),
      'gitlab/createBranch': (step: { with: { [x: string]: string; }; }) => {
        const branchFormValue = { branchName: step.with['branchName'] };
        return this.glassmatrixService.createBranch(step.with['repoName'], branchFormValue).toPromise();
      },
      'gitlab/createBranchAPI': (step: { with: { [x: string]: string; }; }) => this.gitlabService.createBranch(this.gltoken[this.tokenIndex], step.with['owner'], step.with['repoName'], step.with['branchName'], step.with['baseBranch']).toPromise(),
      'gitlab/createBranchLastJiraIssue': (step: { with: { [x: string]: string; }; }) => {
        return this.jiraService.getIssues(this.jiratoken[this.tokenIndex], step.with['domain']).toPromise().then((data) => {
            // @ts-ignore
            if (data && data.issues && data.issues.length > 0) {
              // @ts-ignore
              const lastIssue = data.issues[0];
              const issueid = lastIssue.key;
              const branchFormValue = { branchName: step.with['branchName']+'/'+issueid };
              return this.glassmatrixService.createBranch(step.with['repoName'], branchFormValue).toPromise();
            } else {
              const branchFormValue = { branchName: step.with['branchName'] };
              return this.glassmatrixService.createBranch(step.with['repoName'], branchFormValue).toPromise();
            }
          }
        )
      },
      'gitlab/createFile': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.createFile(step.with['repoName'], step.with['fileName'], step.with['fileContent']).toPromise(),
      'gitlab/createFileAPI': (step: { with: { [x: string]: string; }; }) => {
        const file = { commit_message: step.with['commitMessage'], content: step.with['fileContent'], branch: step.with['branch'] };
        return this.gitlabService.createFile(this.gltoken[this.tokenIndex], step.with['owner'], step.with['repoName'], encodeURIComponent(step.with['fileName']), file).toPromise();
      },
      'gitlab/createCommit': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.createCommit(step.with['repoName'], step.with['fileContent'], step.with['commitMessage']).toPromise(),
      'gitlab/commitAllChanges': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.commitAllChanges(step.with['repoName'], step.with['commitMessage']).toPromise(),
      'gitlab/pushChanges': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.pushChanges(step.with['repoName']).toPromise(),
      'gitlab/mergeLastOpenMR': (step: { with: { [x: string]: string; }; }) => {
        return this.gitlabService.mergeLastOpenMergeRequest(this.gltoken[this.tokenIndex], step.with['owner'], step.with['repoName'], step.with['mergeMessage']).toPromise();
      },
      'gitlab/closeLastOpenMR': (step: { with: { [x: string]: string; }; }) => {
        return this.gitlabService.closeLastOpenMergeRequest(this.gltoken[this.tokenIndex], step.with['owner'], step.with['repoName']).toPromise();
      },
      'gitlab/createMR': (step: { with: { [x: string]: string; }; }) => {
        const mr = { title: step.with['title'], source: step.with['source'], target: step.with['target'], description: step.with['description'] };
        return this.gitlabService.createMergeRequest(this.gltoken[this.tokenIndex], step.with['owner'], step.with['repoName'], mr.title, mr.source, mr.target, mr.description).toPromise();
      },
      'gitlab/createMRLastJiraIssue': (step: { with: { [x: string]: string; }; }) => {
        const mr = { title: step.with['title'], source: step.with['source'], target: step.with['target'], description: step.with['description'] };
        return this.gitlabService.createMergeRequestLastJiraIssue(this.jiratoken[this.tokenIndex], step.with['domain'], this.gltoken[this.tokenIndex], step.with['owner'], step.with['repoName'], mr.title, mr.source, mr.target, mr.description).toPromise();
      },
      'jira/createIssue': (step: { with: { [x: string]: string; }; }) => {
        const issue = { assignee: step.with['assignee'], summary: step.with['summary'], projectkey: step.with['projectkey'], issuetype: parseInt(step.with['issuetype']) };
        return this.jiraService.createIssue(this.jiratoken[this.tokenIndex], step.with['domain'], issue).toPromise();
      },
      'jira/moveIssue': (step: { with: { [x: string]: string; }; }) => this.jiraService.moveIssue(this.jiratoken[this.tokenIndex], step.with['domain'], step.with['issueid'], parseInt(step.with['transition'])).toPromise(),
      'jira/moveLastIssue': (step: { with: { [x: string]: string; }; }) => this.jiraService.moveLastIssue(this.jiratoken[this.tokenIndex], step.with['domain'], parseInt(step.with['transition'])).toPromise()
    },
    'PUT': {
      'github/mergePR': (step: { with: { [x: string]: string; }; }) => this.githubService.mergePullRequest(this.token[this.tokenIndex], step.with['owner'], step.with['repoName'], Number(step.with['prNumber']), step.with['mergeMessage']).toPromise(),
      'github/changeBranch': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.changeBranch(step.with['repoName'], step.with['branchToChangeTo']).toPromise(),
      'gitlab/mergeMR': (step: { with: { [x: string]: string; }; }) => this.gitlabService.mergeMergeRequest(this.gltoken[this.tokenIndex], step.with['owner'], step.with['repoName'], Number(step.with['mrIid']), step.with['mergeMessage']).toPromise(),
      'gitlab/changeBranch': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.changeBranch(step.with['repoName'], encodeURIComponent(step.with['branchToChangeTo'])).toPromise(),
      'gitlab/changeBranchLastJiraIssue': (step: { with: { [x: string]: string; }; }) => {
        return this.jiraService.getIssues(this.jiratoken[this.tokenIndex], step.with['domain']).toPromise().then((data) => {
            // @ts-ignore
            if (data && data.issues && data.issues.length > 0) {
              // @ts-ignore
              const lastIssue = data.issues[0];
              const issueid = lastIssue.key;
              return this.glassmatrixService.changeBranch(step.with['repoName'], encodeURIComponent(step.with['branchToChangeTo']+'/'+issueid)).toPromise();
            } else {
              return this.glassmatrixService.changeBranch(step.with['repoName'], encodeURIComponent(step.with['branchToChangeTo'])).toPromise();
            }
          }
        )
      },
      'jira/editIssue': (step: { with: { [x: string]: string; }; }) => {
        const issue = { assignee: step.with['assignee'], summary: step.with['summary'], projectkey: step.with['projectkey'], issuetype: parseInt(step.with['issuetype']) };
        return this.jiraService.editIssue(this.jiratoken[this.tokenIndex], step.with['domain'], step.with['issueid'], issue).toPromise();
      },
      'jira/editLastIssue': (step: { with: { [x: string]: string; }; }) => {
        const issue = { assignee: step.with['assignee'], summary: step.with['summary'], projectkey: step.with['projectkey'], issuetype: parseInt(step.with['issuetype']) };
        return this.jiraService.editLastIssue(this.jiratoken[this.tokenIndex], step.with['domain'], issue).toPromise();
      }
    },
    'DELETE': {
      'github/deleteRepo': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.deleteRepo(step.with['repoName']).toPromise(),
      'github/deleteBranch': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.deleteBranch(step.with['repoName'], step.with['branchName']).toPromise(),
      'github/deleteBranchAPI': (step: { with: { [x: string]: string; }; }) => this.githubService.deleteBranch(this.token[this.tokenIndex], step.with['owner'], step.with['repoName'], step.with['branchName']).toPromise(),
      'github/deleteFile': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.deleteGithubFile(step.with['repoName'], step.with['fileName']).toPromise(),
      'github/deleteFileAPI': (step: { with: { [x: string]: string; }; }) => {
        const file = { message: step.with['commitMessage'], branch: step.with['branch'] };
        return this.githubService.deleteFile(this.token[this.tokenIndex], step.with['owner'], step.with['repoName'], step.with['fileName'], file).toPromise();
      },
      'gitlab/deleteRepo': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.deleteRepo(step.with['repoName']).toPromise(),
      'gitlab/deleteBranch': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.deleteBranch(step.with['repoName'], encodeURIComponent(step.with['branchName'])).toPromise(),
      'gitlab/deleteBranchAPI': (step: { with: { [x: string]: string; }; }) => this.gitlabService.deleteBranch(this.gltoken[this.tokenIndex], step.with['owner'], step.with['repoName'], encodeURIComponent(step.with['branchName'])).toPromise(),
      'gitlab/deleteBranchLastJiraIssue': (step: { with: { [x: string]: string; }; }) => {
        return this.jiraService.getIssues(this.jiratoken[this.tokenIndex], step.with['domain']).toPromise().then((data) => {
            // @ts-ignore
            if (data && data.issues && data.issues.length > 0) {
              // @ts-ignore
              const lastIssue = data.issues[0];
              const issueid = lastIssue.key;
              this.glassmatrixService.deleteBranch(step.with['repoName'], encodeURIComponent(step.with['branchName']+'/'+issueid)).toPromise()
            } else {
              this.glassmatrixService.deleteBranch(step.with['repoName'], encodeURIComponent(step.with['branchName'])).toPromise()
            }
          }
        )
      },
      'gitlab/deleteFile': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.deleteGithubFile(step.with['repoName'], step.with['fileName']).toPromise(),
      'gitlab/deleteFileAPI': (step: { with: { [x: string]: string; }; }) => {
        const file = { commit_message: step.with['commitMessage'], branch: step.with['branch'] };
        return this.gitlabService.deleteFile(this.gltoken[this.tokenIndex], step.with['owner'], step.with['repoName'], encodeURIComponent(step.with['fileName']), file).toPromise();
      }
    }
  };

  executeYaml(): void {
    this.isLoading = true;
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    this.http.post<YamlData>(`${BASE_URL}/api/convertYaml`, { yaml: this.yamlContent }, { headers }).subscribe(data => {
      this.response = '';
      if (data.config && data.config.useFixedWindow) this.fixedWindow = true;
      else this.fixedWindow = false;
      data.steps.reduce((prevPromise, step: Step) => {
        return prevPromise.then(() => {
          return new Promise(resolve => setTimeout(resolve, 3000))
            .then(() => {
              step = JSON.parse(this.replaceVariables(JSON.stringify(step)));
              // @ts-ignore
              const handler = this.stepHandlers[step.method][step.uses];
              if (step.with && step.with['tokenIndex']) this.tokenIndex = parseInt(step.with['tokenIndex']);
              else this.tokenIndex = 0;
              if (handler) {
                return handler(step).then((response: Response) => {
                  if (response !== undefined) {
                    const responseString = step.uses + ' ' + JSON.stringify(response, null, 2) + '\n\n';
                    this.response += responseString;
                  } else {
                    this.response += step.uses + '\n\n';
                  }
                  console.log(response);
                  // @ts-ignore
                  if (step.variables) {
                    // @ts-ignore
                    step.variables.forEach(vrbl => {
                      // @ts-ignore
                      if (vrbl.array && Array.isArray(response[vrbl.array]) && response[vrbl.array][vrbl.position]) {
                        // @ts-ignore
                        this.variables[vrbl.variable] = response[vrbl.array][vrbl.position][vrbl.key];
                      } else if (vrbl.position) {
                        // @ts-ignore
                        this.variables[vrbl.variable] = response[vrbl.position][vrbl.key];
                      } else {
                        // @ts-ignore
                        this.variables[vrbl.variable] = response[vrbl.key];
                      }
                    });
                    console.log(this.variables);
                  }
                }).catch((error: any) => {
                  console.error(`Error in step ${step.method} ${step.uses}:`, error);
                });
              } else {
                console.error(`No handler found for method ${step.method} and uses ${step.uses}`);
                return Promise.reject(`No handler found for method ${step.method} and uses ${step.uses}`);
              }
            });
        });
      }, Promise.resolve()).then(
        () => {
          this.isLoading = false;
        }
      ).catch(error => {
        console.error(error);
        this.errorMessage = 'Se produjo un error durante la ejecución: ' + error.message;
        this.isLoading = false;
      });
    }, error => {
      console.error(error);
      this.errorMessage = 'Se produjo un error durante la ejecución: ' + error.message;
      this.isLoading = false;
    });
  }
  setDefaultFormat(): void {
    this.yamlContent = `steps:
  - uses: "github/#"
    with:
      repoName: "#"
    method: "#"`;
  }
  postContent(): Observable<any> {
    const dataCopy = JSON.parse(this.data);

    if (dataCopy && dataCopy.metric) {
      if (dataCopy.metric.scope) {
        dataCopy.metric.scope = this.scope;
      }
      if (dataCopy.metric.window) {
        dataCopy.metric.window = this.window;
      }
    }

    return this.bluejayService.postComputation(dataCopy).pipe(
      tap((response: any) => {
        this.computationResponse += JSON.stringify(response, null, 2);
        this.computationUrl = `${COLLECTOR_EVENTS_URL}${response.computation.replace('/api/v2/computations', '')}`;
      }),
      catchError((error: any) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }

  getComputation(): void {
    if (this.computationUrl) {
      setTimeout(() => {
        if (this.computationUrl) {
          this.bluejayService.getComputation(this.computationUrl).subscribe(
            (response: any) => {
              // Agregar la respuesta al contenido existente en lugar de reemplazarlo
              this.computationResponse += JSON.stringify(response, null, 2) + '\n\n';

              // Eliminar todos los datos existentes en la base de datos
              const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
              this.http.delete(`${BASE_URL}/glassmatrix/api/v1/deleteData`, { headers }).subscribe(
                () => {
                  // Guardar la respuesta en la base de datos a través del servidor Express
                  this.http.post(`${BASE_URL}/glassmatrix/api/v1/saveData`, response, { headers }).subscribe(
                    (res) => console.log('Data saved successfully'),
                    (err) => console.error('Error saving data:', err)
                  );
                },
                (err) => console.error('Error deleting data:', err)
              );
            },
            (error: any) => {
              console.error('Error:', error);
            },
          );
        }
      }, 5000);
    }
  }
  private loadData(tpa: string, metric: string, time: boolean): Observable<any> {
    this.tpa = tpa;
    this.fileName2 = metric;
    return this.glassmatrixService.loadFileContent(tpa, this.fileName2).pipe(
      tap(data => {
        this.data = JSON.stringify(data, null, 2);
        const parsedData = JSON.parse(this.data);

        if (parsedData && parsedData.metric) {
          if (parsedData.metric.scope) {
            this.scope.project = parsedData.metric.scope.project || '';
            this.scope.class = parsedData.metric.scope.class || '';
            this.scope.member = parsedData.metric.scope.member || '';
          }
          if(parsedData.metric.window) {
            if(time || !this.fixedWindow){
              const now = new Date();
              if (parsedData.metric.window.period == "hourly") {
                const startOfHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
                const endOfHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 59, 59, 999);

                this.window.from = startOfHour.toISOString();
                this.window.initial = startOfHour.toISOString();
                this.window.end = endOfHour.toISOString();
                console.log(this.window.from);
                console.log(this.window.end);
              } else if (parsedData.metric.window.period == "weekly") {
                const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()+ (now.getDay() == 0 ? -6:1));
                const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() +7, 23, 59, 59, 999);

                this.window.from = startOfWeek.toISOString();
                this.window.initial = startOfWeek.toISOString();
                this.window.end = endOfWeek.toISOString();
                console.log(this.window.from);
                console.log(this.window.end);
              }
            }else{
              this.window.from = parsedData.metric.window.from || '';
              this.window.initial = parsedData.metric.window.initial || '';
              this.window.end = parsedData.metric.window.end || '';
            }
            this.window.type = parsedData.metric.window.type || '';
            this.window.period = parsedData.metric.window.period || '';
            this.window.timeZone = parsedData.metric.window.timeZone || '';
          }
        } else {
          console.error('Cannot read, invalid data');
        }
      })
    );
  }
  private loadIndividualData(metric: string, time: boolean): Observable<any> {
    this.fileName2 = metric;
    return this.filesService.getSavedMetric(this.fileName2).pipe(
      tap(data => {
        this.data = JSON.stringify(data, null, 2);

        const parsedData = JSON.parse(this.data);
        /* Esta zona actualiza la fecha del tpa a la actual */

         /**/
        if (parsedData && parsedData.metric) {
          if (parsedData.metric.scope) {
            this.scope.project = parsedData.metric.scope.project || '';
            this.scope.class = parsedData.metric.scope.class || '';
            this.scope.member = parsedData.metric.scope.member || '';
          }
          if(parsedData.metric.window) {
            if(time || !this.fixedWindow){
              const now = new Date();
              if (parsedData.metric.window.period == "hourly") {
                const startOfHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
                const endOfHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 59, 59, 999);

                this.window.from = startOfHour.toISOString();
                this.window.initial = startOfHour.toISOString();
                this.window.end = endOfHour.toISOString();
                data.metric.window.from = startOfHour.toISOString();
                data.metric.window.initial = startOfHour.toISOString();
                data.metric.window.end = endOfHour.toISOString();
                this.window.from = data.metric.window.from;
                this.window.initial = data.metric.window.initial;
                this.window.end = data.metric.window.end;
              } else if (parsedData.metric.window.period == "weekly") {
                const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()+ (now.getDay() == 0 ? -6:1));
                const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() +7, 23, 59, 59, 999);

                this.window.from = startOfWeek.toISOString();
                this.window.initial = startOfWeek.toISOString();
                this.window.end = endOfWeek.toISOString();

                data.metric.window.from = startOfWeek.toISOString();
                data.metric.window.initial = startOfWeek.toISOString();
                data.metric.window.end = endOfWeek.toISOString();
                this.window.from = data.metric.window.from;
                this.window.initial = data.metric.window.initial;
                this.window.end = data.metric.window.end;
              }
            }else{
              this.window.from = parsedData.metric.window.from;
              this.window.initial = parsedData.metric.window.initial;
              this.window.end = parsedData.metric.window.end;
            }
            this.window.type = parsedData.metric.window.type || '';
            this.window.period = parsedData.metric.window.period || '';
            this.window.timeZone = parsedData.metric.window.timeZone || '';
          }
          console.log(data)
        } else {
          console.error('Cannot read, invalid data');
        }
      })
    );
  }

  removeStatus(index: number): void {
    this.testStatuses.splice(index, 1);
  }

  replaceVariables(text: string): string {
    let matches = text.match(/\$[^$]+\$/g);
    if (matches) {
      matches.forEach(mtch => {
        // @ts-ignore
        if (this.variables[mtch.substring(1,mtch.length-1)]) {
          // @ts-ignore
          text = text.replace(mtch, this.variables[mtch.substring(1,mtch.length-1)]);
        }
      });
    }
    return text;
  }

  openFixedwindowDialog(): void {
    const dialogConfig = new MatDialogConfig();
    const [scrollTop, scrollLeft] = this.viewportScroller.getScrollPosition();
    dialogConfig.position = {
      top: `${scrollTop}px`,
      left: `${scrollLeft}px`
    };
    dialogConfig.autoFocus = false;

    this.dialog.open(FixedwindowhelpComponent, dialogConfig);
  }
}

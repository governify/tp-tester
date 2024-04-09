import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {GlassmatrixService} from "../../../services/glass-matrix.service";
import * as yaml from 'json-to-pretty-yaml';
import {BASE_URL} from "../../../../../lockedConfig";
import {GithubService} from "../../../services/github.service";
import {HttpClient} from "@angular/common/http";

interface YamlData {
  steps: Step[];
}
interface Step {
  method: string;
  uses: string;
  with: {
    [key: string]: string;
  };
}
interface Response {
  data: any;
}
@Component({
  selector: 'app-yaml-edit',
  templateUrl: './yaml-edit.component.html',
  styleUrls: ['./yaml-edit.component.css']
})
export class YamlEditComponent implements OnInit {
  yamlContent!: string;
  fileName!: string;
  errorMessage: string = '';
  response!: any;
  token!: string;
  saveStatusMessage: string = '';
  constructor(
    private route: ActivatedRoute,
    private glassmatrixService: GlassmatrixService,
    private location: Location,
    private githubService: GithubService,
  private http: HttpClient,
  ) { }

  ngOnInit(): void {
    const fileName = this.route.snapshot.paramMap.get('fileName');
    this.getToken();
    if (fileName) {
      this.fileName = fileName;
      this.loadFileContent(fileName);
    }
  }

  loadFileContent(fileName: string) {
    this.glassmatrixService.loadYAMLFile(fileName).subscribe((content) => {
      this.yamlContent = yaml.stringify(content);
    });
  }
  getToken(): void {
    this.glassmatrixService.getToken().subscribe(
      response => {
        this.token = response.token;
      },
      () => this.token = 'Token not found'
    );
  }
  updateYaml() {
    this.glassmatrixService.updateYAMLFile(this.fileName, this.yamlContent).subscribe(
      () => {
        this.saveStatusMessage = 'El archivo se ha guardado correctamente.';
        console.log('El archivo se ha actualizado con éxito.');
      },
      error => {
        console.error('Ha ocurrido un error al actualizar el archivo:', error);
      }
    );
  }
  goBack(): void {
    this.location.back();
  }
  private stepHandlers = {
    'GET': {
      'github/getIssue': (step: { with: { [x: string]: string; }; }) => this.githubService.getIssues(this.token, step.with['owner'], step.with['repoName']).toPromise(),
      'github/getOpenPR': (step: { with: { [x: string]: string; }; }) => this.githubService.getOpenPullRequests(this.token, step.with['owner'], step.with['repoName']).toPromise(),
      'github/pullCurrentBranch': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.pullCurrentBranch(step.with['repoName']).toPromise(),
      'github/listRepos': () => this.glassmatrixService.listRepos().toPromise(),
      'github/getBranches': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.getBranches(step.with['repoName']).toPromise(),
      'github/getRepoInfo': (step: { with: { [x: string]: string; }; }) => this.githubService.getRepoInfo(step.with['repoName'], step.with['branchName']).toPromise()
    },
    'POST': {
      'github/commitAllChanges': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.commitAllChanges(step.with['repoName'], step.with['commitMessage']).toPromise(),
      'github/createIssue': (step: { with: { [x: string]: string; }; }) => {
        const issue = { title: step.with['title'], body: step.with['body'] };
        return this.githubService.createIssue(this.token, step.with['owner'], step.with['repoName'], issue).toPromise();
      },
      'github/createPR': (step: { with: { [x: string]: string; }; }) => {
        const pr = { title: step.with['title'], head: step.with['head'], base: step.with['base'], body: step.with['body'] };
        return this.githubService.createPullRequest(this.token, step.with['owner'], step.with['repoName'], pr.title, pr.head, pr.base, pr.body).toPromise();
      },
      'github/cloneRepo': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.cloneRepo(step.with['owner'], step.with['repoName']).toPromise(),
      'github/createBranch': (step: { with: { [x: string]: string; }; }) => {
        const branchFormValue = { branchName: step.with['branchName'] };
        return this.glassmatrixService.createBranch(step.with['repoName'], branchFormValue).toPromise();
      },
      'github/createFile': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.createFile(step.with['repoName'], step.with['fileName'], step.with['fileContent']).toPromise(),
      'github/createCommit': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.createCommit(step.with['repoName'], step.with['fileContent'], step.with['commitMessage']).toPromise(),
      'github/pushChanges': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.pushChanges(step.with['repoName']).toPromise()
    },
    'PUT': {
      'github/mergePR': (step: { with: { [x: string]: string; }; }) => this.githubService.mergePullRequest(this.token, step.with['owner'], step.with['repoName'], Number(step.with['prNumber']), step.with['mergeMessage']).toPromise(),
      'github/changeBranch': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.changeBranch(step.with['repoName'], step.with['branchToChangeTo']).toPromise()
    },
    'DELETE': {
      'github/deleteRepo': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.deleteRepo(step.with['repoName']).toPromise(),
      'github/deleteBranch': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.deleteBranch(step.with['repoName'], step.with['branchName']).toPromise()
    }
  };

  executeYaml(): void {
    this.http.post<YamlData>(`${BASE_URL}:6012/api/convertYaml`, { yaml: this.yamlContent }).subscribe(data => {
      this.response = '';
      data.steps.reduce((prevPromise, step: Step) => {
        return prevPromise.then(() => {
          this.response += step.uses + '\n';
          // @ts-ignore
          const handler = this.stepHandlers[step.method][step.uses];
          if (handler) {
            return handler(step).then((response: Response) => {
              this.response += JSON.stringify(response, null, 2) + '\n\n';
            });
          } else {
            console.error(`No handler found for method ${step.method} and uses ${step.uses}`);
          }
        });
      }, Promise.resolve()).catch(error => {
        console.error(error);
        this.errorMessage = 'Se produjo un error durante la ejecución: ' + error.message;
      });
    }, error => {
      console.error(error);
      this.errorMessage = 'Se produjo un error durante la ejecución: ' + error.message;
    });
  }
  setDefaultFormat(): void {
    this.yamlContent = `steps:
  - uses: "github/#"
    with:
      repoName: "#"
    method: "#"`;
  }
}

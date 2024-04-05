import { HttpClient } from '@angular/common/http';
import {Component, OnInit} from "@angular/core";
import {GlassmatrixService} from "../../services/glass-matrix.service";
import * as yaml from 'json-to-pretty-yaml';
import { BASE_URL } from "../../../../config";
import {GithubService} from "../../services/github.service";

interface Step {
  method: string;
  uses: string;
  with: {
    [key: string]: string;
  };
}

interface YamlData {
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
  fileName!: string;
  response!: any;
  token!: string;
  constructor(
    private http: HttpClient,
    private glassmatrixService: GlassmatrixService,
    private githubService: GithubService
) { }

  ngOnInit(): void {
    this.loadYamlFiles();
    this.getToken();
  }

  getToken(): void {
    this.glassmatrixService.getToken().subscribe(
      response => {
        this.token = response.token;
      },
      () => this.token = 'Token not found'
    );
  }

  loadYamlFiles() {
    this.glassmatrixService.getAllYAMLFiles().subscribe(files => {
      this.yamlFiles = files;
    });
  }

  saveYaml() {
    this.glassmatrixService.saveYAMLFile(this.fileName, this.yamlContent).subscribe(() => {
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
  executeYaml(): void {
    this.http.post<YamlData>(`${BASE_URL}:6012/api/convertYaml`, { yaml: this.yamlContent }).subscribe(data => {
      // Inicializa response como una cadena vacía
      this.response = '';

      // Utiliza reduce para ejecutar las solicitudes HTTP de forma secuencial
      data.steps.reduce((prevPromise, step) => {
        // @ts-ignore
        return prevPromise.then(() => {
          const repoName = step.with['repoName'];
          const branchName = step.with['branchName'];
          let url = `${BASE_URL}:6012/${step.uses}/${repoName}`;
          const method = step.method;

          // Agrega la ruta del uses a la propiedad response y agrega un salto de línea
          this.response += step.uses + '\n';

          // Si step.uses incluye 'GlassMatrix', sigue la lógica actual
          if (step.uses.includes('glassmatrix')) {
            if (method === 'GET') {
              return this.http.get(url).toPromise().then(response => {
                // Agrega la respuesta y un salto de línea adicional a la propiedad response
                this.response += JSON.stringify(response, null, 2) + '\n\n';
              });
            } else if (method === 'POST') {
              return this.http.post(url, { branchName }).toPromise().then(response => {
                // Agrega la respuesta y un salto de línea adicional a la propiedad response
                this.response += JSON.stringify(response, null, 2) + '\n\n';
              });
            } else if (method === 'DELETE') {
              if (branchName) {
                url += `/${branchName}`;
              }
              return this.http.delete(url).toPromise().then(response => {
                // Agrega la respuesta y un salto de línea adicional a la propiedad response
                this.response += JSON.stringify(response, null, 2) + '\n\n';
              });
            }
          } else {
            // Si no, llama a los métodos correspondientes de GithubService
            if (method === 'GET') {
              if (step.uses === 'github/getIssue') {
                return this.githubService.getIssues(this.token, step.with['owner'], repoName).toPromise().then(response => {
                  this.response += JSON.stringify(response, null, 2) + '\n\n';
                });
              } else if (step.uses === 'github/getOpenPR') {
                return this.githubService.getOpenPullRequests(this.token, step.with['owner'], repoName).toPromise().then(response => {
                  this.response += JSON.stringify(response, null, 2) + '\n\n';
                });
              } else {
                return this.githubService.getRepoInfo(repoName, branchName).toPromise().then(response => {
                  this.response += JSON.stringify(response, null, 2) + '\n\n';
                });
              }
            } else if (method === 'POST') {
              if (step.uses === 'github/createIssue') {
                const issue = { title: step.with['title'], body: step.with['body'] };
                return this.githubService.createIssue(this.token, step.with['owner'], repoName, issue).toPromise().then(response => {
                  this.response += JSON.stringify(response, null, 2) + '\n\n';
                });
              } else if (step.uses === 'github/createPR') {
                const pr = { title: step.with['title'], head: step.with['head'], base: step.with['base'], body: step.with['body'] };
                return this.githubService.createPullRequest(this.token, step.with['owner'], repoName, pr.title, pr.head, pr.base, pr.body).toPromise().then(response => {
                  this.response += JSON.stringify(response, null, 2) + '\n\n';
                });
              }
              // Aquí necesitarás más información para saber qué método de GithubService llamar
            } else if (method === 'PUT') {
              if (step.uses === 'github/mergePR') {
                return this.githubService.mergePullRequest(this.token, step.with['owner'], repoName, Number(step.with['prNumber']), step.with['mergeMessage']).toPromise().then(response => {
                  this.response += JSON.stringify(response, null, 2) + '\n\n';
                });
              }
              // Aquí necesitarás más información para saber qué método de GithubService llamar
            }
          }
        });
      }, Promise.resolve()).catch(error => {
        console.error(error);
      });
    }, error => {
      console.error(error);
    });
  }
  setDefaultFormat(): void {
    this.yamlContent = `steps:
  - uses: "glassmatrix/api/v1/github/#"
    with:
      repoName: "#"
    method: "#"`;
  }

}

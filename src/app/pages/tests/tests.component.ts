import { HttpClient } from '@angular/common/http';
import {Component, OnInit} from "@angular/core";
import {GlassmatrixService} from "../../services/glass-matrix.service";
import * as yaml from 'json-to-pretty-yaml';
import { BASE_URL } from "../../../../lockedConfig";
import {GithubService} from "../../services/github.service";
import {BluejayService} from "../../services/bluejay.service";
import {catchError, Observable, tap, throwError} from "rxjs";
import {FilesService} from "../../services/files.service";

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
  tpa!: string;
  token!: string;
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
  constructor(
    private http: HttpClient,
    private glassmatrixService: GlassmatrixService,
    private githubService: GithubService,
    private bluejayService: BluejayService,
    private filesService: FilesService
) { this.computationResponse = ''; }

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
    'GET': {
      'github/getIssue': (step: { with: { [x: string]: string; }; }) => this.githubService.getIssues(this.token, step.with['owner'], step.with['repoName']).toPromise(),
      'github/getOpenPR': (step: { with: { [x: string]: string; }; }) => this.githubService.getOpenPullRequests(this.token, step.with['owner'], step.with['repoName']).toPromise(),
      'github/pullCurrentBranch': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.pullCurrentBranch(step.with['repoName']).toPromise(),
      'github/listRepos': () => this.glassmatrixService.listRepos().toPromise(),
      'github/getBranches': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.getBranches(step.with['repoName']).toPromise(),
      'github/getRepoInfo': (step: { with: { [x: string]: string; }; }) => this.githubService.getRepoInfo(step.with['repoName'], step.with['branchName']).toPromise()
    },
    'POST': {
      'bluejay/checkContain': (step: { with: { [x: string]: string; }; }) => {
        // Obtener la clave a buscar y el valor mínimo esperado
        const key = step.with['key'];
        const minExpectedValue = Number(step.with['minExpectedValue']);

        // Hacer una solicitud GET al endpoint '/getData/:key'
        return this.http.get<any>(`http://localhost:6012/getData/${key}`, {}).toPromise().then((data: any) => {
          // Comprueba si el campo especificado existe en los datos devueltos
          if (data && data[0] && data[0][key]) {
            const value = data[0][key];
            // Comprueba si el valor obtenido es mayor o igual al valor mínimo esperado
            if (value >= minExpectedValue) {
              // Si es así, empuja un mensaje indicando que el test ha sido superado a this.testStatuses
              this.testStatuses.push({ text: `Test successfully completed. ${key}=${value}`, success: true });
            } else {
              // Si no es así, empuja un mensaje indicando que el test no ha sido superado a this.testStatuses
              this.testStatuses.push({ text: `Test failed. ${key}=${value}`, success: false });
            }
          } else {
            // Si no existe, empuja un mensaje indicando que no hay coincidencias a this.testStatuses
            this.testStatuses.push({ text: `No records found for the field '${key}' in the database`, success: false });
          }
        });
      },
      'bluejay/compute/tpa': (step: { with: { [x: string]: string; }; }) => {
        // Leer el contenido del archivo
        const tpa = step.with['tpa'];
        const metric = step.with['metric'];
        return this.loadData(tpa, metric).toPromise().then(() => {
          // Ejecutar postComputation
          this.postContent().subscribe(response => {
            // Esperar 10 segundos y luego llamar a getComputation
            setTimeout(() => {
              this.getComputation();
              console.log(this.computationUrl)
            }, 1000);
          });
        });
      },
      'bluejay/compute/metric': (step: { with: { [x: string]: string; }; }) => {
        // Leer el contenido del archivo
        const metric = step.with['metric'];
        return this.loadIndividualData(metric).toPromise().then(() => {
          // Ejecutar postComputation
          this.postContent().subscribe(response => {
            // Esperar 10 segundos y luego llamar a getComputation
            setTimeout(() => {
              this.getComputation();
              console.log(this.computationUrl)
            }, 1000);
          });
        });
      },
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
      'github/commitAllChanges': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.commitAllChanges(step.with['repoName'], step.with['commitMessage']).toPromise(),
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
        // @ts-ignore
        const handler = this.stepHandlers[step.method][step.uses];
        if (handler) {
          return handler(step).then((response: Response) => {
            if(step.uses === 'bluejay/compute/tpa' || step.uses === 'bluejay/compute/metric') {
              this.computationResponse += step.uses + '\n';
            }else{
              this.response += step.uses + '\n' + JSON.stringify(response, null, 2) + '\n\n';
            }
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
        this.computationUrl = `${BASE_URL}:5500${response.computation}`;
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
              this.http.delete(`${BASE_URL}:6012/deleteData`).subscribe(
                () => {
                  // Guardar la respuesta en la base de datos a través del servidor Express
                  this.http.post(`${BASE_URL}:6012/saveData`, response).subscribe(
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
  private loadData(tpa: string, metric: string): Observable<any> {
    this.tpa = tpa;
    this.fileName = metric;
    return this.glassmatrixService.loadFileContent(tpa, this.fileName).pipe(
      tap(data => {
        this.data = JSON.stringify(data, null, 2);
        const parsedData = JSON.parse(this.data);
        console.log(parsedData); // Aquí está el console.log
        if (parsedData && parsedData.metric) {
          if (parsedData.metric.scope) {
            this.scope.project = parsedData.metric.scope.project || '';
            this.scope.class = parsedData.metric.scope.class || '';
            this.scope.member = parsedData.metric.scope.member || '';
          }
          if(parsedData.metric.window) {
            this.window.type = parsedData.metric.window.type || '';
            this.window.period = parsedData.metric.window.period || '';
            this.window.initial = parsedData.metric.window.initial || '';
            this.window.from = parsedData.metric.window.from || '';
            this.window.end = parsedData.metric.window.end || '';
            this.window.timeZone = parsedData.metric.window.timeZone || '';
          }
        } else {
          console.error('Cannot read, invalid data');
        }
      })
    );
  }
  private loadIndividualData(metric: string): Observable<any> {
    this.fileName = metric;
    return this.filesService.getSavedMetric(this.fileName).pipe(
      tap(data => {
        this.data = JSON.stringify(data, null, 2);
        const parsedData = JSON.parse(this.data);
        console.log(parsedData); // Aquí está el console.log
        if (parsedData && parsedData.metric) {
          if (parsedData.metric.scope) {
            this.scope.project = parsedData.metric.scope.project || '';
            this.scope.class = parsedData.metric.scope.class || '';
            this.scope.member = parsedData.metric.scope.member || '';
          }
          if(parsedData.metric.window) {
            this.window.type = parsedData.metric.window.type || '';
            this.window.period = parsedData.metric.window.period || '';
            this.window.initial = parsedData.metric.window.initial || '';
            this.window.from = parsedData.metric.window.from || '';
            this.window.end = parsedData.metric.window.end || '';
            this.window.timeZone = parsedData.metric.window.timeZone || '';
          }
        } else {
          console.error('Cannot read, invalid data');
        }
      })
    );
  }

  removeStatus(index: number): void {
    this.testStatuses.splice(index, 1);
  }
}

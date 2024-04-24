import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {GlassmatrixService} from "../../../services/glass-matrix.service";
import * as yaml from 'json-to-pretty-yaml';
import {BASE_URL} from "../../../../../lockedConfig";
import {GithubService} from "../../../services/github.service";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import {BluejayService} from "../../../services/bluejay.service";
import {FilesService} from "../../../services/files.service";

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
  fileName2!: string;
  isLoading = false;
  errorMessage: string = '';
  response!: any;
  token!: string;
  saveStatusMessage: string = '';
  testStatuses: { text: string, success: boolean }[] = [];
  computationUrl: string | null = null;
  data!: string;
  filename!: string;
  computationResponse!: any;
  tpa!: string;
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
    private route: ActivatedRoute,
    private glassmatrixService: GlassmatrixService,
    private location: Location,
    private githubService: GithubService,
    private http: HttpClient,
    private bluejayService: BluejayService,
    private filesService: FilesService
  ) {this.computationResponse = ''; }

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
    'TEST': {
      'bluejay/check': (step: { with: { key: string, conditions: { minExpectedValue?: string, maxExpectedValue?: string, expectedValue?: string } }[]; value?: string, createdAt?: string, authorLogin?: string }) => {
        this.isLoading = true;
        // Hacer una solicitud GET al endpoint '/getData/:key' para cada key
        return Promise.all(step.with.map(({ key, conditions }) => {
          return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
              this.http.get<any>(`http://localhost:6012/glassmatrix/api/v1/getData/${key}`, {}).subscribe((data: any) => {
                // Comprueba si el campo especificado existe en los datos devueltos
                if (data) {
                  let keyFound = false;
                  data.forEach((item: any) => {
                    // Si 'value' no está definido en el paso, o si es igual al 'value' en el objeto de datos, entonces procesa el objeto
                    if (item[key] && (step.value === undefined || item['value'] == step.value)) {
                      const value = item[key];
                      // Comprueba si el valor de la clave es "not found"
                      if (value === "not found") {
                        this.testStatuses.push({ text: `Test failed. Field '${key}' not found in the database`, success: false });
                        this.isLoading = false;
                        resolve();
                      } else {
                        keyFound = true;
                        // Comprueba cada condición por separado
                        if (conditions.minExpectedValue !== undefined) {
                          if (value >= Number(conditions.minExpectedValue)) {
                            this.testStatuses.push({ text: `Test successfully completed.\nCondition: minExpectedValue=${conditions.minExpectedValue}\nResult: ${key}=${value}`, success: true });
                          } else {
                            this.testStatuses.push({ text: `Test failed.\nCondition: minExpectedValue=${conditions.minExpectedValue}\nResult: ${key}=${value}`, success: false });
                          }
                        }
                        if (conditions.maxExpectedValue !== undefined) {
                          if (value <= Number(conditions.maxExpectedValue)) {
                            this.testStatuses.push({ text: `Test successfully completed.\nCondition: maxExpectedValue=${conditions.maxExpectedValue}\nResult: ${key}=${value}`, success: true });
                          } else {
                            this.testStatuses.push({ text: `Test failed.\nCondition: maxExpectedValue=${conditions.maxExpectedValue}\nResult: ${key}=${value}`, success: false });
                          }
                        }
                        if (conditions.expectedValue !== undefined) {
                          if (Number(value) === Number(conditions.expectedValue)) {
                            this.testStatuses.push({ text: `Test successfully completed.\nCondition: expectedValue=${conditions.expectedValue}\nResult: ${key}=${value}`, success: true });
                          } else {
                            this.testStatuses.push({ text: `Test failed.\nCondition: expectedValue=${conditions.expectedValue}\nResult: ${key}=${value}`, success: false });
                          }
                        }
                        this.isLoading = false;
                        resolve();
                      }
                    }
                  });
                  if (!keyFound) {
                    this.testStatuses.push({ text: `Test failed. Field '${key}' not found in the database`, success: false });
                  }
                } else {
                  // Si no hay datos, empuja un mensaje indicando que el test ha fallado a this.testStatuses
                  this.testStatuses.push({ text: `Test failed. Field '${key}' not found in the database`, success: false });
                  this.isLoading = false;
                  resolve();
                }
              }, reject);
            }, 10000);
          });
        }));
      },
    },
    'GET': {
      'github/getIssue': (step: { with: { [x: string]: string; }; }) => this.githubService.getIssues(this.token, step.with['owner'], step.with['repoName']).toPromise(),
      'github/getOpenPR': (step: { with: { [x: string]: string; }; }) => this.githubService.getOpenPullRequests(this.token, step.with['owner'], step.with['repoName']).toPromise(),
      'github/pullCurrentBranch': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.pullCurrentBranch(step.with['repoName']).toPromise(),
      'github/listRepos': () => this.glassmatrixService.listRepos().toPromise(),
      'github/getBranches': (step: { with: { [x: string]: string; }; }) => this.glassmatrixService.getBranches(step.with['repoName']).toPromise(),
      'github/getRepoInfo': (step: { with: { [x: string]: string; }; }) => this.githubService.getRepoInfo(step.with['repoName'], step.with['branchName']).toPromise()
    },
    'POST': {
      'github/mergeLastOpenPR': (step: { with: { [x: string]: string; }; }) => {
        return this.githubService.mergeLastOpenPullRequest(this.token, step.with['owner'], step.with['repoName'], step.with['mergeMessage']).toPromise();
      },
      'bluejay/compute/tpa': (step: { with: { [x: string]: string; }; }) => {
        // Leer el contenido del archivo
        const tpa = step.with['tpa'];
        const metric = step.with['metric'];
        const time = step.with['actualTime'] === 'true';
        return this.loadData(tpa, metric, time).toPromise().then((data) => {
          // Imprimir los datos devueltos por loadData
          console.log(data);

          // Ejecutar postComputation
          this.postContent().subscribe(response => {
            // Esperar 10 segundos y luego llamar a getComputation
            setTimeout(() => {
              this.getComputation();
            }, 1000);
          });
        });
      },
      'bluejay/compute/metric': (step: { with: { [x: string]: string; }; }) => {
        // Leer el contenido del archivo
        const metric = step.with['metric'];
        const time = step.with['actualTime'] === 'true';
        return new Promise<void>((resolve, reject) => {
          this.loadIndividualData(metric, time).subscribe(
            () => {
              // Ejecutar postComputation
              this.postContent().subscribe(response => {
                // Esperar 10 segundos y luego llamar a getComputation
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
        this.isLoading = true;
        return new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            this.http.get<any>(`http://localhost:6012/glassmatrix/api/v1/getData/${key}`, {}).subscribe((data: any) => {
              this.testStatuses.push({ text: `Deprecation Warning: 'bluejay/checkContain' has been deprecated. Please use 'TEST' method with 'bluejay/check' instead.`, success: false });
              if (data && data[0] && data[0][key]) {
                const value = data[0][key];
                if (value >= minExpectedValue) {
                  this.testStatuses.push({ text: `Test successfully completed. ${key}=${value}`, success: true });
                  this.isLoading = false;
                  resolve();
                } else {
                  this.testStatuses.push({ text: `Test failed. ${key}=${value}`, success: false });
                  this.isLoading = false;
                  resolve();
                }
              } else {
                this.testStatuses.push({ text: `No records found for the field '${key}' in the database`, success: false });
                this.isLoading = false;
                resolve();
              }
            }, reject);
          }, 10000);
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
              } else if(step.uses === 'bluejay/check' || step.uses === 'bluejay/checkContain') {
                this.response += step.uses + '\n';
              }else{
                // Verificar si la respuesta no es undefined antes de agregarla a la respuesta
                if (response !== undefined) {
                  // Construir la cadena completa antes de agregarla a la respuesta
                  const responseString = step.uses + ' ' + JSON.stringify(response, null, 2) + '\n\n';
                  this.response += responseString;
                } else {
                  this.response += step.uses + '\n\n';
                }
              }
            });
          } else {
            console.error(`No handler found for method ${step.method} and uses ${step.uses}`);
            return Promise.reject(`No handler found for method ${step.method} and uses ${step.uses}`);
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
              this.http.delete(`${BASE_URL}:6012/glassmatrix/api/v1/deleteData`).subscribe(
                () => {
                  // Guardar la respuesta en la base de datos a través del servidor Express
                  this.http.post(`${BASE_URL}:6012/glassmatrix/api/v1/saveData`, response).subscribe(
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
            if(time){
              const now = new Date();
              const startOfHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
              const endOfHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, -1);

              this.window.from = startOfHour.toISOString();
              this.window.initial = startOfHour.toISOString();
              this.window.end = endOfHour.toISOString();
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
            if(time){
              const now = new Date();
              const startOfHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()+2);
              let endOfHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 3);
              endOfHour.setSeconds(endOfHour.getSeconds() - 1);

              this.window.from = startOfHour.toISOString();
              this.window.initial = startOfHour.toISOString();
              this.window.end = endOfHour.toISOString();
            }else{
              this.window.from = parsedData.metric.window.from;
              this.window.initial = parsedData.metric.window.initial;
              this.window.end = parsedData.metric.window.end;
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

  removeStatus(index: number): void {
    this.testStatuses.splice(index, 1);
  }
}

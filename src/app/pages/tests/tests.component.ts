import { HttpClient } from '@angular/common/http';
import {Component, OnInit} from "@angular/core";
import {GlassmatrixService} from "../../services/glass-matrix.service";
import * as yaml from 'json-to-pretty-yaml';
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
  constructor(
    private http: HttpClient,
    private glassmatrixService: GlassmatrixService
) { }

  ngOnInit(): void {
    this.loadYamlFiles();
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
    this.http.post<YamlData>('http://localhost:6012/api/convertYaml', { yaml: this.yamlContent }).subscribe(data => {
      // Inicializa response como una cadena vacía
      this.response = '';

      // Utiliza reduce para ejecutar las solicitudes HTTP de forma secuencial
      data.steps.reduce((prevPromise, step) => {
        // @ts-ignore
        return prevPromise.then(() => {
          const repoName = step.with['repoName'];
          const branchName = step.with['branchName'];
          let url = `http://localhost:6012/${step.uses}/${repoName}`;
          const method = step.method;

          // Agrega la ruta del uses a la propiedad response y agrega un salto de línea
          this.response += step.uses + '\n';

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

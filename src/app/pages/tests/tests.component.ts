import { HttpClient } from '@angular/common/http';
import {Component, OnInit} from "@angular/core";
import {GlassmatrixService} from "../../services/glass-matrix.service";
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
  executeYaml(): void {
    this.http.post<YamlData>('http://localhost:6012/api/convertYaml', { yaml: this.yamlContent }).subscribe(data => {
      for (const step of data.steps) {
        const repoName = step.with['repoName'];
        const url = `http://localhost:6012/${step.uses}/${repoName}`;
        const body = step.with;
        const method = step.method;
        if (method === 'GET') {
          this.http.get(url, { params: body }).subscribe(response => {
            console.log(response);
          }, error => {
            console.error(error);
          });
        } else if (method === 'POST') {
          this.http.post(url, body).subscribe(response => {
            console.log(response);
          }, error => {
            console.error(error);
          });
        }
        // etc.
      }
    }, error => {
      console.error(error);
    });
  }
}

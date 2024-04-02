import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';
import { BluejayService } from '../../../../services/bluejay.service';
import {FilesService} from "../../../../services/files.service";
import {GlassmatrixService} from "../../../../services/glass-matrix.service";

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.css']
})
export class SectionsComponent implements OnInit {

  tpaId!: string;
  tpaData: any;
  tpaDataJson!: string;
  metrics: any = {};
  metricsJson: { [key: string]: string } = {};
  guarantees: any[] = [];
  guaranteesJson: string[] = [];
  newMetricName = '';
  newMetricContent = '';
  newGuaranteeName = '';
  newGuaranteeContent = '';
  constructor(
    private bluejayService: BluejayService,
    private route: ActivatedRoute,
    private location: Location,
    private filesService: FilesService,
    private glassmatrixService: GlassmatrixService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.tpaId = id;
        this.bluejayService.getTpa(id).subscribe(data => {
          this.tpaData = data;
          this.tpaDataJson = JSON.stringify(this.tpaData, null, 2);
          if (this.tpaData && this.tpaData.terms && this.tpaData.terms.metrics) {
            this.metrics = this.tpaData.terms.metrics;
            for (const key in this.metrics) {
              if (Object.prototype.hasOwnProperty.call(this.metrics, key)) {
                this.metricsJson[key] = JSON.stringify(this.metrics[key], null, 2);
              }
            }
          } else {
            console.error('Cannot read, invalid data');
          }
          if (this.guarantees && this.tpaData.terms && this.tpaData.terms.guarantees) {
            this.guarantees = this.tpaData.terms.guarantees;
            for (let i = 0; i < this.guarantees.length; i++) {
              this.guaranteesJson[i] = JSON.stringify(this.guarantees[i], null, 2);
            }
          } else {
            console.error('Cannot read, invalid data');
          }
        });
      }
    });
  }

  getKeyAsString(key: unknown): string {
    return String(key);
  }

  goBack() {
    this.location.back();
  }

  addMetric() {
    if (this.newMetricName && this.newMetricContent) {
      this.metricsJson[this.newMetricName] = this.newMetricContent;
      this.newMetricName = '';
      this.newMetricContent = '';
    }
    this.saveChanges();
  }

  addGuarantee() {
    if (this.newGuaranteeName && this.newGuaranteeContent) {
      this.guaranteesJson.push(this.newGuaranteeContent);
      this.newGuaranteeName = '';
      this.newGuaranteeContent = '';
    }
    this.saveChanges();
  }

  saveChanges() {
    // Actualiza el objeto metrics en tpaData con los valores de metricsJson
    for (const key in this.metricsJson) {
      if (Object.prototype.hasOwnProperty.call(this.metricsJson, key)) {
        console.log('metricsJson[' + key + ']:', this.metricsJson[key]);
        this.tpaData.terms.metrics[key] = JSON.parse(this.metricsJson[key]);
      }
    }

    // Actualiza el array guarantees en tpaData con los valores de guaranteesJson
    for (let i = 0; i < this.guaranteesJson.length; i++) {
      console.log('guaranteesJson[' + i + ']:', this.guaranteesJson[i]);
      this.tpaData.terms.guarantees[i] = JSON.parse(this.guaranteesJson[i]);
    }

    // Elimina el TPA actual
    this.bluejayService.deleteTpa(this.tpaId).subscribe(() => {
      console.log("Todo el json: ", this.tpaData)
      this.bluejayService.createTpa(JSON.stringify(this.tpaData)).subscribe(() => {
        window.location.reload();
      });
    });
  }

  copyExampleMetric() {
    this.filesService.getExampleMetric().subscribe((exampleMetric) => {
      this.newMetricName = Object.keys(exampleMetric)[0]; // Obtener la primera clave del objeto
      this.newMetricContent = JSON.stringify(exampleMetric, null, 2);
    });
  }

  deleteMetric(key: any) {
    const keyAsString = key as string;
    delete this.metricsJson[keyAsString];
    delete this.tpaData.terms.metrics[keyAsString];
    this.saveChanges();
  }

  deleteGuarantee(index: number) {
    this.guaranteesJson.splice(index, 1);
    this.tpaData.terms.guarantees.splice(index, 1);
    this.saveChanges();
  }

  copyExampleGuarantee() {
    this.filesService.getExampleGuarantee().subscribe((exampleGuarantee) => {
      this.newGuaranteeName = exampleGuarantee.id;
      this.newGuaranteeContent = JSON.stringify(exampleGuarantee, null, 2);
    });
  }

  exportMetric(metricKey: unknown): void {
    if (typeof metricKey !== 'string') {
      console.error('Error: metricKey is not a string');
      return;
    }
    const metricContent = this.metricsJson[metricKey];

    // Parsear el contenido del textarea a un objeto JSON
    const parsedMetricContent = JSON.parse(metricContent);

    // Extraer el contenido de githubGQL
    const githubGQL = parsedMetricContent.measure.event.githubGQL;

    let parts = this.tpaId.split('-');
    let restOfParts = parts.slice(1);
    let restOfString = restOfParts.join('-');
    let className = parts[1];
    // Crear un nuevo objeto JSON con la plantilla proporcionada
    const newMetricContent = {
      "config": {
        "scopeManager": "http://host.docker.internal:5700/api/v1/scopes/development"
      },
      "metric": {
        "computing": "actual",
        "element": "number",
        "event": {

          githubGQL

        },
        "scope": {
          "project": `${restOfString}`,
          "class": `${className}`,
          "member": "*"
        },
        "window": {
          "type": "static",
          "period": "hourly",
          "initial": "2024-04-01T00:00:00.000Z",
          "from": "2024-04-01T00:00:00.000Z",
          "end": "2024-04-01T23:59:59.999Z",
          "timeZone": "America/Los_Angeles"
        }
      }
    }

    // Convertir el nuevo objeto JSON a una cadena JSON
    const newMetricContentString = JSON.stringify(newMetricContent, null, 2);

    this.glassmatrixService.saveTPAMetricToJson(metricKey, this.tpaId, newMetricContentString).subscribe(() => {
      console.log('Metric exported successfully');
      this.router.navigate(['/metrics-loader']).then(() => {
        window.scrollTo(0, 0);
      });
    }, error => {
      console.error('Error exporting metric:', error);
    });
  }
  updateMetricContent(metricKey: string, newContent: string): void {
    this.metricsJson[metricKey] = newContent;
  }
}

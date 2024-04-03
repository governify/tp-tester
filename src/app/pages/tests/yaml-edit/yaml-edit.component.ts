import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {GlassmatrixService} from "../../../services/glass-matrix.service";
import * as yaml from 'json-to-pretty-yaml';

@Component({
  selector: 'app-yaml-edit',
  templateUrl: './yaml-edit.component.html',
  styleUrls: ['./yaml-edit.component.css']
})
export class YamlEditComponent implements OnInit {
  yamlContent!: string;
  fileName!: string;

  constructor(
    private route: ActivatedRoute,
    private glassmatrixService: GlassmatrixService,
    private location: Location
  ) { }

  ngOnInit(): void {
    const fileName = this.route.snapshot.paramMap.get('fileName');
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
  updateYaml() {
    this.glassmatrixService.updateYAMLFile(this.fileName, this.yamlContent).subscribe(
      () => {
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
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlassmatrixService } from '../../../services/glass-matrix.service';
import * as yaml from 'json-to-pretty-yaml';
import {Location} from "@angular/common";

@Component({
  selector: 'app-yaml-view',
  templateUrl: './yaml-view.component.html',
  styleUrls: ['./yaml-view.component.css']
})
export class YamlViewComponent implements OnInit {
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

  goBack(): void {
    this.location.back();
  }
}

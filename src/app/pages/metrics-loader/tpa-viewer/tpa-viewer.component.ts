import { Component, OnInit } from '@angular/core';
import {FilesService} from "../../../services/files.service";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {GlassmatrixService} from "../../../services/glass-matrix.service";

@Component({
  selector: 'app-tpa-viewer',
  templateUrl: './tpa-viewer.component.html',
  styleUrls: ['./tpa-viewer.component.css']
})
export class TpaViewerComponent implements OnInit {
  data!: string;
  response: string | null = null;
  searchTerm!: string;
  fileName!: string;
  messageClass = '';
  message = '';
  constructor(private glassmatrix: GlassmatrixService, private route: ActivatedRoute, private location: Location) { }
  isLoading = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const tpa = params.get('tpa');
      const fileName = params.get('fileName');
      if (tpa && fileName) {
        this.fileName = fileName;
        this.glassmatrix.loadFileContent(tpa, fileName).subscribe(data => {
          this.data = JSON.stringify(data, null, 2);
        });
      }
    });
  }

  search() {
    const textarea = document.getElementById('dataTextarea') as HTMLTextAreaElement;
    const index = this.data.indexOf(this.searchTerm);
    if (index !== -1) {
      textarea.focus();
      textarea.setSelectionRange(index, index + this.searchTerm.length);
      const lineHeight = textarea.clientHeight / textarea.rows;
      const jump = (textarea.value.substr(0, index).match(/\n/g) || []).length;
      textarea.scrollTo(0, jump * lineHeight);
    } else {
      this.message = 'Word not found in response!';
      this.messageClass = 'error';
    }
  }

  goBack(): void {
    this.location.back();
  }
}

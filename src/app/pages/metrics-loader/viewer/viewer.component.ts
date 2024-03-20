import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {FilesService} from "../../../services/files.service";

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent implements OnInit {
  data!: string;
  response: string | null = null;
  searchTerm!: string;
  fileName!: string;
  constructor(private filesService: FilesService, private route: ActivatedRoute, private location: Location) { }
  isLoading = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const fileName = params.get('fileName');
      if (fileName) {
        this.fileName = fileName;
        this.filesService.getSavedMetric(fileName).subscribe(data => {
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
      alert('Word not found!');
    }
  }

  goBack(): void {
    this.location.back();
  }
}

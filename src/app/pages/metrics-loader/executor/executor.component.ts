import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Location} from "@angular/common";
import {FilesService} from "../../../services/files.service";
import {BluejayService} from "../../../services/bluejay.service";
import {GlassmatrixService} from "../../../services/glass-matrix.service";
import {MatDialog} from "@angular/material/dialog";
import {ScriptInfoComponent} from "../../../components/dialogs/script-info/script-info.component";
import {BASE_URL} from "../../../../../lockedConfig";

@Component({
  selector: 'app-executor',
  templateUrl: './executor.component.html',
  styleUrls: ['./executor.component.css']
})
export class ExecutorComponent implements OnInit {
  data!: string;
  response: string | null = null;
  computationUrl: string | null = null;
  searchTerm!: string;
  searchTermResponse!: string;
  fileName!: string;
  message = '';
  messageClass = '';
  message2 = '';
  messageClass2 = '';
  message3 = '';
  messageClass3 = '';

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
    private filesService: FilesService,
    private bluejayService: BluejayService,
    private glassmatrixService: GlassmatrixService,
    private route: ActivatedRoute,
    private location: Location,
    public dialog: MatDialog
  ) { }
  isLoading = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const fileName = params.get('fileName');
      if (fileName) {
        this.fileName = fileName;
        this.filesService.getSavedMetric(fileName).subscribe(data => {
          this.data = JSON.stringify(data, null, 2);
          const parsedData = JSON.parse(this.data);
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
        });
      }
    });
  }
  openGuideDialog(event: Event): void {
    event.preventDefault();
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    const dialogRef = this.dialog.open(ScriptInfoComponent, {
      width: '90%',
      height: '90%',
      panelClass: 'mat-dialog-container',
      autoFocus: false
    });
    dialogRef.afterOpened().subscribe(() => {
      window.scrollTo({ top: scrollPosition });
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Guía añadida: ${result}`);
    });
  }
  postContent(): void {
    this.isLoading = true;
    const dataCopy = JSON.parse(this.data);

    if (dataCopy && dataCopy.metric) {
      if (dataCopy.metric.scope) {
        dataCopy.metric.scope = this.scope;
      }
      if (dataCopy.metric.window) {
        dataCopy.metric.window = this.window;
      }
    }

    this.bluejayService.postComputation(dataCopy).subscribe(
      (response: any) => {
        this.response = JSON.stringify(response, null, 2);
        this.computationUrl = `${BASE_URL}:5500${response.computation}`;
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error:', error);
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  getComputation(): void {
    if (this.computationUrl) {
      this.isLoading = true;
      setTimeout(() => {
        if (this.computationUrl) {
          this.bluejayService.getComputation(this.computationUrl).subscribe(
            (response: any) => {
              this.response = JSON.stringify(response, null, 2);
              this.isLoading = false;
            },
            (error: any) => {
              console.error('Error:', error);
              this.isLoading = false;
            },
            () => {
              this.isLoading = false;
            }
          );
        }
      }, 5000);
    }
  }

  search() {
    const textarea = document.getElementById('dataTextarea') as HTMLTextAreaElement;
    const index = this.response ? this.response.indexOf(this.searchTermResponse) : -1;
    if (index !== -1) {
      textarea.focus();
      textarea.setSelectionRange(index, index + this.searchTerm.length);
      const lineHeight = textarea.clientHeight / textarea.rows;
      const jump = (textarea.value.substr(0, index).match(/\n/g) || []).length;
      textarea.scrollTo(0, jump * lineHeight);
    } else {
      this.message2 = 'Word not found!';
      this.messageClass2 = 'error';
    }
  }

  searchResponse() {
    const textarea = document.getElementById('responseTextarea') as HTMLTextAreaElement;
    // @ts-ignore
    const index = this.response.indexOf(this.searchTermResponse);
    if (index !== -1) {
      textarea.focus();
      textarea.setSelectionRange(index, index + this.searchTermResponse.length);
      const lineHeight = textarea.clientHeight / textarea.rows;
      const jump = (textarea.value.substr(0, index).match(/\n/g) || []).length;
      textarea.scrollTo(0, jump * lineHeight);
    } else {
      this.message3 = 'Word not found!';
      this.messageClass3 = 'error';
    }
  }

  saveToJson(): void {
    if (!this.fileName) {
      this.message = 'Filename cannot be empty';
      this.messageClass = 'error';
      return;
    }

    const data = JSON.parse(this.data);
    if (data && data.metric) {
      if(data.metric.scope){
        data.metric.scope.project = this.scope.project;
        data.metric.scope.class = this.scope.class;
        data.metric.scope.member = this.scope.member;
      } else if (data.metric.window) {
        data.metric.window.type = this.window.type;
        data.metric.window.period = this.window.period;
        data.metric.window.initial = this.window.initial;
        data.metric.window.from = this.window.from;
        data.metric.window.end = this.window.end;
        data.metric.window.timeZone = this.window.timeZone;
      }
    } else {
      this.message = 'Cannot save, invalid data';
      this.messageClass = 'error';
      return;
    }

    this.glassmatrixService.updateFile(this.fileName, data).subscribe(
      () => {
        this.message = 'File saved successfully';
        this.messageClass = 'success';
      },
      (error) => {
        this.message = 'An error occurred: ' + error;
        this.messageClass = 'error';
      }
    );
  }
  setToCurrentHour(): void {
    const now = new Date();
    const startOfHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
    const endOfHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, -1);

    this.window.from = startOfHour.toISOString();
    this.window.initial = startOfHour.toISOString();
    this.window.end = endOfHour.toISOString();
  }

  goBack(): void {
    this.location.back();
  }
}

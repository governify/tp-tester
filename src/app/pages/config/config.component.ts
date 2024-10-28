import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {GithubhelpComponent} from "../../components/dialogs/githubhelp/githubhelp.component";
import {ViewportScroller} from "@angular/common";
import { BASE_URL } from 'lockedConfig';

interface Container {
  Id: string;
  Name: string;
  Url: string;
  Port: number;
}

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  containers: Container[] = [];
  pdfUrl: SafeResourceUrl;
  showWarning = true;
  showWarningHelp = true;
  baseUrl = BASE_URL;
  showConfigWarning = true;
  config = {
    BASE_URL: '',
    DEFAULT_COLLECTOR: '',
    COLLECTOR_EVENTS_URL: '',
    AGREEMENTS_URL: '',
    SCOPES_URL: ''
  };
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private viewportScroller: ViewportScroller,) {
    this.getConfig()
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${BASE_URL}:6012/glassmatrix/api/v1/pdf#toolbar=0`);
  }

  ngOnInit(): void {
    const portsToHandle = ['3000/tcp', '80/tcp', '8086/tcp', '27017/tcp', '5173/tcp', '6379/tcp'];
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    this.http.get<any[]>(`${BASE_URL}:6012/api/containers`, { headers }).subscribe(containers => {
      // @ts-ignore
      this.containers = containers.flatMap(container => {
        const ports = container.NetworkSettings.Ports;
        // @ts-ignore
        return portsToHandle.flatMap(internalPort => {
          const portData = ports[internalPort];
          if (portData && portData[0]) {
            const hostPort = portData[0].HostPort;
            return {
              Id: container.Id,
              Name: container.Name.slice(1),
              Url: `${BASE_URL}:${hostPort}`,
              Port: Number(hostPort),
            };
          }
        }).filter(Boolean);
      }).filter(Boolean);
    });
  }
  getConfig() {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    this.http.get(`${BASE_URL}:6012/glassmatrix/api/v1/config`, { headers }).subscribe((config: any) => {
      this.config = config;
    });
  }

  updateConfig() {
    const headers = new HttpHeaders({ "x-access-key": `${localStorage.getItem('access-key')}` });
    this.http.post(`${BASE_URL}:6012/glassmatrix/api/v1/config`, this.config, { headers }).subscribe(() => {
      alert('Config updated successfully');
    });
  }
  openGithubDialog(): void {
    const dialogConfig = new MatDialogConfig();
    const [scrollTop, scrollLeft] = this.viewportScroller.getScrollPosition();
    dialogConfig.position = {
      top: `${scrollTop}px`,
      left: `${scrollLeft}px`
    };
    dialogConfig.autoFocus = false;

    this.dialog.open(GithubhelpComponent, dialogConfig);
  }
}

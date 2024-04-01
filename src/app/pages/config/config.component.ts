import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {GithubhelpComponent} from "../../components/dialogs/githubhelp/githubhelp.component";
import {ViewportScroller} from "@angular/common";

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
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private viewportScroller: ViewportScroller) {
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('http://localhost:6012/glassmatrix/api/v1/pdf#toolbar=0');
  }

  ngOnInit(): void {
    const portsToHandle = ['3000/tcp', '80/tcp', '8086/tcp', '27017/tcp', '5173/tcp', '6379/tcp'];
    this.http.get<any[]>('http://localhost:6012/api/containers').subscribe(containers => {
      // @ts-ignore
      this.containers = containers.flatMap(container => {
        const ports = container.NetworkSettings.Ports;
        // @ts-ignore
        return portsToHandle.flatMap(internalPort => {
          const portData = ports[internalPort];
          if (portData && portData[0]) {
            const hostPort = portData[0].HostPort;
            console.log(hostPort);
            return {
              Id: container.Id,
              Name: container.Name.slice(1),
              Url: `http://localhost:${hostPort}`,
              Port: Number(hostPort),
            };
          }
        }).filter(Boolean);
      }).filter(Boolean);
    });
  }

  openGithubDialog(): void {
    const dialogConfig = new MatDialogConfig();
    const [scrollTop, scrollLeft] = this.viewportScroller.getScrollPosition();
    dialogConfig.position = {
      top: `${scrollTop}px`,
      left: `${scrollLeft}px`
    };
    dialogConfig.autoFocus = false;  // Evita que Angular Material mueva el enfoque al primer elemento enfocable dentro del diálogo

    this.dialog.open(GithubhelpComponent, dialogConfig);
  }
}
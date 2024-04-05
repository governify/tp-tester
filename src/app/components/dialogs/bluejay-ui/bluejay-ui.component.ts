import { Component, OnInit } from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {MatDialogRef} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {BASE_URL} from "../../../../../config";

@Component({
  selector: 'app-bluejay-ui',
  templateUrl: './bluejay-ui.component.html',
  styleUrls: ['./bluejay-ui.component.css']
})
export class BluejayUiComponent implements OnInit {
  guideText = '';
  urlSafe: SafeResourceUrl;

  constructor(private http: HttpClient,
              public sanitizer: DomSanitizer,
              public dialogRef: MatDialogRef<BluejayUiComponent>) {
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(`${BASE_URL}:5100/render?model=http://host.docker.internal:5200/api/v1/public/renders/index/model.json&view=http://host.docker.internal:5200/api/v1/public/renders/index/view.html&ctrl=http://host.docker.internal:5200/api/v1/public/renders/index/controller.js`);
  }


  ngOnInit(): void {
    this.http.get(`${BASE_URL}:5100/render?model=http://host.docker.internal:5200/api/v1/public/renders/index/model.json&view=http://host.docker.internal:5200/api/v1/public/renders/index/view.html&ctrl=http://host.docker.internal:5200/api/v1/public/renders/index/controller.js`, {
      headers: {
        Authorization: 'Basic ' + btoa('bluejay:bluejay')       },
      responseType: 'text'
    }).subscribe(response => {
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(response);
    });
  }
  close(): void {
    this.dialogRef.close(this.guideText);
  }

  ngAfterViewInit(): void {
    document.addEventListener('click', (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        const anchor = event.target;
        if (anchor.target === '_blank') {
          event.preventDefault();
          window.location.href = anchor.href;
        }
      }
    });
  }
}

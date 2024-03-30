import { Component, OnInit } from '@angular/core';
import {MatDialogConfig, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-githubhelp',
  templateUrl: './githubhelp.component.html',
  styleUrls: ['./githubhelp.component.css']
})
export class GithubhelpComponent implements OnInit {
  guideText = '';
  constructor(
    public dialogRef: MatDialogRef<GithubhelpComponent>) {}

  ngOnInit(): void {
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

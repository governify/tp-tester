import { Component, OnInit } from '@angular/core';
import {MatDialogConfig, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-fixedwindowhelp',
  templateUrl: './fixedwindowhelp.component.html',
  styleUrls: ['./fixedwindowhelp.component.css']
})
export class FixedwindowhelpComponent implements OnInit {
  guideText = '';
  constructor(
    public dialogRef: MatDialogRef<FixedwindowhelpComponent>) {}

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

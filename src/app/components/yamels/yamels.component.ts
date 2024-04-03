import { Component } from '@angular/core';

@Component({
  selector: 'app-yamels',
  templateUrl: './yamels.component.html',
  styleUrls: ['./yamels.component.css']
})
export class YamelsComponent {
  copyContent(elementId: string) {
    const copyText = document.getElementById(elementId) as HTMLTextAreaElement;
    copyText.select();
    document.execCommand('copy');
  }
}

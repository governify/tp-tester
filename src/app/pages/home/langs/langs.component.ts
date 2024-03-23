import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-langs',
  templateUrl: './langs.component.html',
  styleUrls: ['./langs.component.css']
})
export class LangsComponent implements OnInit {

  constructor(private translate: TranslateService) { }
  jsonExampleContent!: string;

  ngOnInit() {
    this.translate.get('HOME.LANGS.JSON_EXAMPLE_CONTENT').subscribe((res: string) => {
      this.jsonExampleContent = res.replace(/\\n/g, '\n').replace(/\\"/g, '"');
    });
  }

}

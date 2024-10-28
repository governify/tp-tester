import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {BluejayUiComponent} from "../dialogs/bluejay-ui/bluejay-ui.component";
import { BASE_URL} from "../../../../lockedConfig";
import { GlassmatrixService } from 'src/app/services/glass-matrix.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isElectron: boolean;
  isBackendEnabled: boolean = false;
  private url = `${BASE_URL}:6012/glassmatrix/api/v1`;

  constructor(private translate: TranslateService, public dialog: MatDialog, private glassmatrixService: GlassmatrixService) {
    // @ts-ignore
    this.isElectron = window && window.process && window.process.type;
  }
  changeLanguage(lang: string) {
    this.translate.use(lang);
  }
  ngOnInit(): void {
    this.glassmatrixService.checkBackendEnabled().subscribe(isEnabled => this.isBackendEnabled = isEnabled);
    this.glassmatrixService.getBackendEnabled.subscribe(isEnabled => this.isBackendEnabled = isEnabled);
  }
  openWebDialog() {
    this.dialog.open(BluejayUiComponent, {
      height: '80%',
      width: '80%',
    });
  }
}

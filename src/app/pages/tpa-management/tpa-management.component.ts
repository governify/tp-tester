import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import {FilesService} from "../../services/files.service";
import {BluejayService} from "../../services/bluejay.service";
@Component({
  selector: 'app-tpa-management',
  templateUrl: './tpa-management.component.html',
  styleUrls: ['./tpa-management.component.css']
})
export class TpaManagementComponent implements OnInit {
  tps: any;
  tpaContent!: string;
  notificationMessage: string = '';
  lastOperationSuccessful: boolean | null = null;
  constructor(private bluejayService: BluejayService, private cdr: ChangeDetectorRef, private filesService: FilesService) { }

  ngOnInit(): void {
    this.getTps()
  }

  getTps(): void {
    this.bluejayService.getTps().subscribe(data => {
      this.tps = data;
    });
  }
  copyTpaContent(tpa: any) {
    this.tpaContent = JSON.stringify(tpa, null, 2);
  }
  createTpa() {
    this.bluejayService.createTpa(this.tpaContent).subscribe(
      () => {
        this.notificationMessage = 'TPA created successfully!';
        this.lastOperationSuccessful = true;
        this.getTps();
      },
      (error) => {
        this.notificationMessage = 'Error creating TPA: ' + error.message;
        this.lastOperationSuccessful = false;
      }
    );
  }

  copyDefaultTPA() {
    this.filesService.getDefaultTPA().subscribe(data => {
      this.tpaContent = data;
    });
  }
}

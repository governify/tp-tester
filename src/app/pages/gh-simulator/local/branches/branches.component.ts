import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import {Location} from "@angular/common";
import {GlassmatrixService} from "../../../../services/glass-matrix.service";

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class BranchesComponent implements OnInit {
  branches: string[] = [];
  repoName!: string | null;
  branchForm!: FormGroup;
  selectedBranch!: string;
  branchToChangeTo!: string;
  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private location: Location, private glassmatrixService: GlassmatrixService) { }

  ngOnInit(): void {
    this.repoName = this.route.snapshot.paramMap.get('repoName');
    this.branchForm = this.formBuilder.group({
      branchName: ''
    });

    this.getBranches();
  }

  getBranches(): void {
    this.glassmatrixService.getBranches(this.repoName!).subscribe(data => {
      this.branches = data.branches;
    });
  }

  onSubmit(): void {
    this.glassmatrixService.createBranch(this.repoName!, this.branchForm.value).subscribe(() => {
      this.getBranches();
      this.branchForm.reset();
    });
  }

  deleteBranch() {
    this.glassmatrixService.deleteBranch(this.repoName!, this.selectedBranch).subscribe(() => {
      this.getBranches();
    });
  }

  pullBranch() {
    this.glassmatrixService.pullCurrentBranch(this.repoName!).subscribe();
  }

  changeBranch() {
    this.glassmatrixService.changeBranch(this.repoName!, this.branchToChangeTo).subscribe(() => {
      this.getBranches();
    });
  }
  goBack(): void {
    this.location.back();
  }
}

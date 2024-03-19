import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import {Location} from "@angular/common";

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class BranchesComponent implements OnInit {
  branches: string[] = [];
  private apiUrl = 'http://localhost:4202/glassmatrix/api/v1/github';
  repoName!: string | null;
  branchForm!: FormGroup;
  selectedBranch!: string;
  branchToChangeTo!: string;
  constructor(private http: HttpClient, private route: ActivatedRoute, private formBuilder: FormBuilder, private location: Location) { }

  ngOnInit(): void {
    this.repoName = this.route.snapshot.paramMap.get('repoName');
    this.branchForm = this.formBuilder.group({
      branchName: ''
    });

    this.getBranches();
  }

  getBranches(): void {
    this.http.get<any>(`${this.apiUrl}/branches/${this.repoName}`).subscribe(data => {
      this.branches = data.branches;
    });
  }

  onSubmit(): void {
    this.http.post<any>(`${this.apiUrl}/createBranch/${this.repoName}`, this.branchForm.value).subscribe(() => {
      this.getBranches();
      this.branchForm.reset();
    });
  }

  deleteBranch() {
    this.http.delete(`${this.apiUrl}/deleteBranch/${this.repoName}/${this.selectedBranch}`).subscribe(() => {
      this.getBranches();
    });
  }

  pullBranch() {
    this.http.get(`${this.apiUrl}/pullCurrentBranch/${this.repoName}`).subscribe();
  }

  changeBranch() {
    this.http.post(`${this.apiUrl}/changeBranch/${this.repoName}/${this.branchToChangeTo}`, {}).subscribe(() => {
      this.getBranches();
    });
  }
  goBack(): void {
    this.location.back();
  }
}

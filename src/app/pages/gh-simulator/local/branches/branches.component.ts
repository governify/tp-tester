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
  private apiUrl = 'http://localhost:4202';
  repoName!: string | null;
  branchForm!: FormGroup;

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

  goBack(): void {
    this.location.back();
  }
}

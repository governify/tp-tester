import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-yamels',
  templateUrl: './yamels.component.html',
  styleUrls: ['./yamels.component.css']
})

export class YamelsComponent implements OnInit {
  p: number = 1;
  searchTerm: string = '';
  sections = [
    {
      id: 'example1',
      content:
        `- uses: "github/getBranches"
      with:
        repoName: "tp-testbench"
      method: "GET"`
    },
    {
      id: 'example2',
      content:
        `- uses: "github/createBranch"
      with:
        repoName: "tp-testbench"
        branchName: "branchNameHere"
      method: "POST"`
    },
    {
      id: 'example3',
      content: `- uses: "github/deleteBranch"
      with:
        repoName: "tp-testbench"
        branchName: "branchNameHere"
      method: "DELETE"`
    },
    {
      id: 'example4',
      content: `- uses: "github/getIssue"
      with:
        repoName: "tp-testbench"
        owner: "Antoniiosc7"
      method: "GET"`
    },
    {
      id: 'example5',
      content: `- uses: "github/createIssue"
      with:
        repoName: "tp-testbench"
        owner: "Antoniiosc7"
        title: "titleText"
        body: "bodyText"
      method: "POST"`
    },
    {
      id: 'example6',
      content: `- uses: "github/createPR"
      with:
        repoName: "tp-testbench"
        owner: "Antoniiosc7"
        title: "title1"
        head: "main"
        base: "branchX"
        body: "bodyText"
      method: "POST"`
    },
    {
      id: 'example7',
      content: `- uses: "github/getOpenPR"
      with:
        repoName: "tp-testbench"
        owner: "Antoniiosc7"
      method: "GET"`
    },
    {
      id: 'example8',
      content: `- uses: "github/mergePR"
      with:
        repoName: "tp-testbench"
        owner: "Antoniiosc7"
        prNumber: "1"
        mergeMessage: "merged"
      method: "PUT"`
    },
    {
      id: 'example9',
      content: `- uses: "github/pullCurrentBranch"
      with:
        repoName: "tp-testbench"
      method: "GET"`
    },
    {
      id: 'example10',
      content: `- uses: "github/createFile"
      with:
        repoName: "tp-testbench"
        fileName: "file.txt"
        fileContent: "content"
      method: "POST"`
    },
    {
      id: 'example11',
      content: `- uses: "github/commitAllChanges"
      with:
        repoName: "tp-testbench"
        commitMessage: "commit message"
      method: "POST"`
    },
    {
      title: '',
      id: 'example12',
      content: `- uses: "github/pushChanges"
      with:
        repoName: "tp-testbench"
      method: "POST"`
    },
    {
      id: 'example13',
      content: `- uses: "bluejay/compute/tpa"
      with:
        collector: "EVENTS"
        tpa: "tpa-TFG-GH-antoniiosc7_Glassmatrix"
        metric: "working_metric.json"
      method: "POST"`
    },
    {
      id: 'example14',
      content: `- uses: "bluejay/compute/metric"
      with:
        actualTime: "true/false"
        collector: "EVENTS"
        metric: "additions_metric.json"
      method: "POST"`
    },
    {
      id: 'example15',
      content: `- uses: "bluejay/check"
      value: "1" //optional
      with:
        - key: "additions"
          conditions:
            minExpectedValue: "5"
            maxExpectedValue: "12"
        - key: "additions"
          conditions:
            minExpectedValue: "5"
            maxExpectedValue: "12"
        - key: "key1"
          conditions:
            expectedValue: "value1"
      method: "TEST"`
    },
    {
      id: 'example16',
      content: `uses: "github/mergeLastOpenPR"
      with:
        repoName: "tp-testbench"
        owner: "Antoniiosc7"
        mergeMessage: "mergedPR"
      method: "POST"`
    },
    {
      id: 'example17',
      content: `- uses: "bluejay/findCheck"
      with:
        values:
          - value: 1
            computationCount: 1
            evidences:
              login: "Antoniiosc7"
              bodyText: "wip"
      method: "TEST"`
    },
    {
      id: 'example18',
      content: `- uses: "github/deleteFile"
      with:
        repoName: "tp-testbench"
        fileName: "name_of_file"
      method: "DELETE"`
    },
    {
      id: 'example19',
      content: `- uses: "github/deleteRepo"
      with:
        repoName: "tp-testbench"
      method: "DELETE"`
    },
    {
      id: 'example20',
      content: `- uses: "github/changeBranch"
      with:
        repoName: "tp-testbench"
        branchToChangeTo: "branch2"
      method: "PUT"`
    },
    {
      id: 'example21',
      content: `uses: "github/createBranch"
      with:
        repoName: "tp-testbench"
        branchName: "branch2"
      method: "POST"`
    },
    {
      id: 'example22',
      content: `- uses: "bluejay/checkContain"
      with:
        key: "additions"
        minExpectedValue: "5"
      method: "POST"`
    },
    {
      id: 'example23',
      content: `- uses: "github/cloneRepo"
      with:
        owner: "Antoniiosc7"
        repoName: "tp-testbench"
      method: "POST"`
    },
    {
      id: 'example24',
      content: `- uses: "github/getRepoInfo"
      with:
        repoName: "tp-testbench"
        branchName: "main"
      method: "GET"`
    },
    {
      id: 'example25',
      content: `- uses: "github/listRepos"
      method: "GET"`
    },
    {
      id: 'example26',
      content:
        `- uses: "gitlab/getBranches"
      with:
        repoName: "tp-testbench"
      method: "GET"`
    },
    {
      id: 'example27',
      content:
        `- uses: "gitlab/createBranch"
      with:
        repoName: "tp-testbench"
        branchName: "branchNameHere"
      method: "POST"`
    },
    {
      id: 'example28',
      content: `- uses: "gitlab/deleteBranch"
      with:
        repoName: "tp-testbench"
        branchName: "branchNameHere"
      method: "DELETE"`
    },
    {
      id: 'example29',
      content: `- uses: "jira/getIssues"
      with:
        domain: "localhost:8080"
      method: "GET"`
    },
    {
      id: 'example30',
      content: `- uses: "jira/createIssue"
      with:
        domain: "localhost:8080"
        assignee: "Antoniiosc7"
        summary: "summaryText"
        projectkey: "KAN"
        issuetype: "10001"
      method: "POST"`
    },
    {
      id: 'example31',
      content: `- uses: "gitlab/createMR"
      with:
        repoName: "tp-testbench"
        owner: "Antoniiosc7"
        title: "title1"
        target: "main"
        source: "branchX"
        description: "descriptionText"
      method: "POST"`
    },
    {
      id: 'example32',
      content: `- uses: "gitlab/getOpenMR"
      with:
        repoName: "tp-testbench"
        owner: "Antoniiosc7"
      method: "GET"`
    },
    {
      id: 'example33',
      content: `- uses: "gitlab/mergeMR"
      with:
        repoName: "tp-testbench"
        owner: "Antoniiosc7"
        mrIid: "1"
        mergeMessage: "merged"
      method: "PUT"`
    },
    {
      id: 'example34',
      content: `- uses: "gitlab/pullCurrentBranch"
      with:
        repoName: "tp-testbench"
      method: "GET"`
    },
    {
      id: 'example35',
      content: `- uses: "gitlab/createFile"
      with:
        repoName: "tp-testbench"
        fileName: "file.txt"
        fileContent: "content"
      method: "POST"`
    },
    {
      id: 'example36',
      content: `- uses: "gitlab/commitAllChanges"
      with:
        repoName: "tp-testbench"
        commitMessage: "commit message"
      method: "POST"`
    },
    {
      title: '',
      id: 'example37',
      content: `- uses: "gitlab/pushChanges"
      with:
        repoName: "tp-testbench"
      method: "POST"`
    },
    {
      id: 'example38',
      content: `uses: "gitlab/mergeLastOpenMR"
      with:
        repoName: "tp-testbench"
        owner: "Antoniiosc7"
        mergeMessage: "mergedPR"
      method: "POST"`
    },
    {
      id: 'example39',
      content: `- uses: "gitlab/deleteFile"
      with:
        repoName: "tp-testbench"
        fileName: "name_of_file"
      method: "DELETE"`
    },
    {
      id: 'example40',
      content: `- uses: "gitlab/deleteRepo"
      with:
        repoName: "tp-testbench"
      method: "DELETE"`
    },
    {
      id: 'example41',
      content: `- uses: "gitlab/changeBranch"
      with:
        repoName: "tp-testbench"
        branchToChangeTo: "branch2"
      method: "PUT"`
    },
    {
      id: 'example42',
      content: `uses: "gitlab/createBranch"
      with:
        repoName: "tp-testbench"
        branchName: "branch2"
      method: "POST"`
    },
    {
      id: 'example43',
      content: `- uses: "gitlab/cloneRepo"
      with:
        owner: "Antoniiosc7"
        repoName: "tp-testbench"
      method: "POST"`
    },
    {
      id: 'example44',
      content: `- uses: "gitlab/getRepoInfo"
      with:
        repoName: "tp-testbench"
        branchName: "main"
      method: "GET"`
    },
    {
      id: 'example45',
      content: `- uses: "gitlab/listRepos"
      method: "GET"`
    },
    {
      id: 'example46',
      content: `- uses: "jira/editIssue"
      with:
        domain: "localhost:8080"
        issueid: "KAN-1"
        assignee: "Antoniiosc7"
        summary: "summaryText"
        projectkey: "KAN"
        issuetype: "10001"
      method: "PUT"`
    },
    {
      id: 'example47',
      content: `- uses: "jira/moveIssue"
      with:
        domain: "localhost:8080"
        issueid: "KAN-1"
        transition: "21"
      method: "POST"`
    }
  ];

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.sections.forEach(section => {
      this.translate.get('section.' + section.id).subscribe((res: string) => {
        section.title = res;
      });
    });
  }

  copyContent(elementId: string) {
    const copyText = document.getElementById(elementId) as HTMLTextAreaElement;
    copyText.select();
    document.execCommand('copy');
  }
  filteredSections = this.sections; // Add this line

  searchMetric(): void {
    if (this.searchTerm) {
      this.filteredSections = this.sections.filter(section =>
        section.title && section.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredSections = this.sections;
    }
  }
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredSections = this.sections;
  }
}

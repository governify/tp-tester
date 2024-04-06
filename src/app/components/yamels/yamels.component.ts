import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-yamels',
  templateUrl: './yamels.component.html',
  styleUrls: ['./yamels.component.css']
})

export class YamelsComponent implements OnInit {
  p: number = 1;
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
        branchName: "nombreDeLaRama_adios2"
      method: "POST"`
    },
    {
      id: 'example3',
      content: `- uses: "github/deleteBranch"
      with:
        repoName: "tp-testbench"
        branchName: "nombreDeLaRama_adios2"
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
        title: "hello"
        body: "body"
      method: "POST"`
    },
    {
      id: 'example6',
      content: `- uses: "github/createIssue"
      with:
        repoName: "tp-testbench"
        owner: "Antoniiosc7"
        title: "title1"
        head: "head"
        base: "base"
        body: "body"
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
        prNumber: "7"
        mergeMessage: "mergeado"
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
        fileName: "sevillafc232"
        fileContent: "sevilla fc campeon"`
    },
    {
      id: 'example11',
      content: `- uses: "github/commitAllChanges"
      with:
        repoName: "tp-testbench"
        commitMessage: "subida sevilla sevillafc232"
      method: "POST"`
    },
    {
      title: '',
      id: 'example12',
      content: `- uses: "github/pushChanges"
      with:
        repoName: "tp-testbench"
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

}

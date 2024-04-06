import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-yamels',
  templateUrl: './yamels.component.html',
  styleUrls: ['./yamels.component.css']
})
export class YamelsComponent implements OnInit {
  p: number = 1;
  sections = [
    {
      title: 'Ramas del repositorio',
      id: 'example1',
      content:
        `- uses: "github/getBranches"
      with:
        repoName: "tp-testbench"
      method: "GET"`
    },
    {
      title: 'Crear rama',
      id: 'example2',
      content:
        `- uses: "github/createBranch"
      with:
        repoName: "tp-testbench"
        branchName: "nombreDeLaRama_adios2"
      method: "POST"`
    },
    {
      title: 'Delete rama',
      id: 'example3',
      content: `- uses: "github/deleteBranch"
      with:
        repoName: "tp-testbench"
        branchName: "nombreDeLaRama_adios2"
      method: "DELETE"`
    },
    {
      title: 'Ver issues',
      id: 'example4',
      content: `- uses: "github/getIssue"
      with:
        repoName: "tp-testbench"
        owner: "Antoniiosc7"
      method: "GET"`
    },
    {
      title: 'Crear issues',
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
      title: 'Crear PR',
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
      title: 'PRs Abiertas',
      id: 'example7',
      content: `- uses: "github/getOpenPR"
      with:
        repoName: "tp-testbench"
        owner: "Antoniiosc7"
      method: "GET"`
    },
    {
      title: 'Mergear una PR',
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
      title: 'Hacer un pull de la rama',
      id: 'example9',
      content: `- uses: "github/pullCurrentBranch"
      with:
        repoName: "tp-testbench"
      method: "GET"`
    },
    {
      title: 'Crear archivo',
      id: 'example10',
      content: `- uses: "github/createFile"
      with:
        repoName: "tp-testbench"
        fileName: "sevillafc232"
        fileContent: "sevilla fc campeon"`
    },
    {
      title: 'Hacer commit',
      id: 'example11',
      content: `- uses: "github/commitAllChanges"
      with:
        repoName: "tp-testbench"
        commitMessage: "subida sevilla sevillafc232"
      method: "POST"`
    },
    {
      title: 'Hacer push',
      id: 'example12',
      content: `- uses: "github/pushChanges"
      with:
        repoName: "tp-testbench"
      method: "POST"`
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  copyContent(elementId: string) {
    const copyText = document.getElementById(elementId) as HTMLTextAreaElement;
    copyText.select();
    document.execCommand('copy');
  }
}

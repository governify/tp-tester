import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable, switchMap, throwError} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class JiraService {
  constructor(private http: HttpClient) {
  }

  // Método para obtener las issues de un proyecto
  getIssues(token: string, domain: string): Observable<any[]> {
    console.log('Enviando');
    const url = `https://${domain}/rest/api/latest/search?fields=assignee,updated,status`;
    const headers = {
      'Authorization': 'Bearer ' + token
    };
    console.log(headers);

    return this.http.get<any[]>(url, { headers });
  }

  // Método para crear una issue en un proyecto
  createIssue(token: string, domain: string, issue: {assignee: string, summary: string, projectkey: string, issuetype: number}): Observable<any> {
    const url = `https://${domain}/rest/api/latest/issue`;
    const headers = {
      'Authorization': 'Bearer ' + token
    };

    return this.http.post(url, {fields: {assignee: {name: issue.assignee}, summary: issue.summary, project: {key: issue.projectkey}, issuetype: {id: issue.issuetype}}}, { headers });
  }

  // Método para editar una issue en un proyecto
  editIssue(token: string, domain: string, issueid: string, issue: {assignee: string, summary: string, projectkey: string, issuetype: number}): Observable<any> {
    const url = `https://${domain}/rest/api/latest/issue/${issueid}`;
    const headers = {
      'Authorization': 'Bearer ' + token
    };

    return this.http.put(url, {fields: {assignee: {name: issue.assignee}, summary: issue.summary, project: {key: issue.projectkey}, issuetype: {id: issue.issuetype}}}, { headers });
  }

  editLastIssue(token: string, domain: string, issue: {assignee: string, summary: string, projectkey: string, issuetype: number}): Observable<any> {
    return this.getIssues(token, domain).pipe(
      switchMap((data: any) => {
        if (data.issues && data.issues.length > 0) {
          const lastIssue = data.issues[0];
          const issueid = lastIssue.key;

          const url = `https://${domain}/rest/api/latest/issue/${issueid}`;
          const headers = {
            'Authorization': 'Bearer ' + token
          };

          return this.http.put(url, {fields: {assignee: {name: issue.assignee}, summary: issue.summary, project: {key: issue.projectkey}, issuetype: {id: issue.issuetype}}}, { headers });
        } else {
          throw new Error('No issues found');
        }
      })
    );
  }

  // Método para mover una issue en un proyecto
  moveIssue(token: string, domain: string, issueid: string, transition: number): Observable<any> {
    const url = `https://${domain}/rest/api/latest/issue/${issueid}/transitions`;
    const headers = {
      'Authorization': 'Bearer ' + token
    };

    return this.http.post(url, {transition: {id: transition}}, { headers });
  }

  moveLastIssue(token: string, domain: string, transition: number): Observable<any> {
    return this.getIssues(token, domain).pipe(
      switchMap((data: any) => {
        if (data.issues && data.issues.length > 0) {
          const lastIssue = data.issues[0];
          const issueid = lastIssue.key;

          const url = `https://${domain}/rest/api/latest/issue/${issueid}/transitions`;
          const headers = {
            'Authorization': 'Bearer ' + token
          };

          return this.http.post(url, {transition: {id: transition}}, { headers });
        } else {
          throw new Error('No issues found');
        }
      })
    );
  }
}

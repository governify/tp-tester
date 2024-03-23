import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(private http: HttpClient) { }

  getDefaultTPA(): Observable<string> {
    return this.http.get('assets/defaultTPA.json', {responseType: 'text'});
  }

  getBasicMetric(): Observable<any> {
    return this.http.get('assets/basicMetric.json');
  }

  getSavedMetric(fileName: string): Observable<any> {
    return this.http.get(`assets/savedMetrics/${fileName}`);
  }

  getExampleMetric(): Observable<any> {
    return this.http.get('assets/examples/exampleMetric.json');
  }

  getExampleGuarantee(): Observable<any> {
    return this.http.get('assets/examples/exampleGuarantee.json');
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AGREEMENTS_URL, BASE_URL, COLLECTOR_EVENTS_URL} from '../../../lockedConfig';
@Injectable({
  providedIn: 'root'
})
export class BluejayService {

  //private url = `${BASE_URL}:5400/api/v6/agreements`;
  private url = `${AGREEMENTS_URL}`;
  constructor(private http: HttpClient) { }

  createTpa(tpaContent: string): Observable<any> {
    const tpaData = JSON.parse(tpaContent);
    return this.http.post(this.url, tpaData, {responseType: 'text'});
  }

  getTps(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  getTpa(id: string): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }

  deleteTpa(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, {responseType: 'text'});
  }

  postComputation(data: any): Observable<any> {
    //return this.http.post(`${BASE_URL}:5500/api/v2/computations`, data);
    return this.http.post(`${COLLECTOR_EVENTS_URL}`, data);
  }

  getComputation(computationUrl: string): Observable<any> {
    return this.http.get(computationUrl);
  }

}

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
}

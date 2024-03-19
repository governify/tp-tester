import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlassmatrixService {
  private url = 'http://localhost:4202/glassmatrix/api/v1';
  constructor(private http: HttpClient) { }

  saveToJson(fileName: string, data: any): Observable<any> {
    return this.http.post(`${this.url}/tpa/save`, { fileName: fileName, content: data });
  }
}

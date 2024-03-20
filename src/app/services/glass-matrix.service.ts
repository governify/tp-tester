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

  deleteFile(fileName: string): Observable<any> {
    return this.http.delete(`${this.url}/tpa/files/${fileName}`);
  }

  loadFiles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/tpa/files`);
  }

  updateFile(fileName: string, data: any): Observable<any> {
    return this.http.post(`${this.url}/tpa/update`, { fileName: fileName, content: data });
  }
}

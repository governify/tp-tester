import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Container {
  Id: string;
  Name: string;
  Url: string;
  Port: number;
}
@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  containers: Container[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<Container[]>('http://localhost:6012/api/containers').subscribe(containers => {
      this.containers = containers.map(container => ({
        Id: container.Id,
        Name: container.Name.slice(1),  // Remove the leading '/' from the name
        Url: container.Url,
        Port: container.Port,
      }));
    });
  }
}

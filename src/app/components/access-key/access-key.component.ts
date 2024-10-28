import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlassmatrixService } from 'src/app/services/glass-matrix.service';

@Component({
  selector: 'app-access-key',
  templateUrl: './access-key.component.html',
  styleUrls: ['./access-key.component.css']
})
export class AccessKeyComponent implements OnInit {
  key!: string;
  showKey = false;
  showEdit = false;
  newKey!: string;

  constructor(private router: Router, private glassmatrixSevice: GlassmatrixService) { }

  ngOnInit(): void {
    this.getKey();
  }

  getKey(): void {
    this.key = this.glassmatrixSevice.getKey();
  }

  saveKey(): void {
    this.glassmatrixSevice.saveKey(this.newKey);
    this.key = this.newKey;
    this.newKey = '';
    this.router.routeReuseStrategy.shouldReuseRoute = () => { return false; };
    this.router.navigate(['/config']);
  }

  updateKey(): void {
    this.glassmatrixSevice.saveKey(this.newKey);
    this.showEdit = false;
    this.showKey = false;
    this.router.routeReuseStrategy.shouldReuseRoute = () => { return false; };
    this.router.navigate(['/config']);
  }
}

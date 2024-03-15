import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  jugadoresLogueados: number;
  jugadoresOnline: number;

  images = [
    'https://i.epvpimg.com/lV2Ch.jpg',
    'https://wallpapers.com/images/hd/beautiful-minecraft-old-european-town-2akdleckboycwoqh.jpg',
    'https://wallpapers.com/images/hd/4k-minecraft-brick-city-er4qs8jb5mbio1e1.jpg'
  ];

  currentImage = 0;

  constructor() {
    this.jugadoresLogueados = this.getRandomNumber(70, 100);
    this.jugadoresOnline = this.getRandomNumber(9, 30);
    setInterval(() => {
      this.currentImage++;
      if (this.currentImage >= this.images.length) {
        this.currentImage = 0;
      }
    }, 6000);
  }

  ngOnInit(): void {
  }

  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

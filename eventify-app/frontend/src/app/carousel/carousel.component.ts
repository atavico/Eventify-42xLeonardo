import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.components.html',
  styleUrls: ['./carousel.components.css'],
})
export class CarouselComponent {
  slides: string[];
  i: number;

  @Input()
  imgArray: string[];

  constructor() {
    this.i = 0;
  }
  getSlide() {
    return this.imgArray[this.i];
  }

  getPrev() {
    this.i == 0 ? (this.i = this.imgArray.length - 1) : this.i--;
  }

  getNext() {
    this.i < this.imgArray.length - 1 ? this.i++ : (this.i = 0);
  }
}
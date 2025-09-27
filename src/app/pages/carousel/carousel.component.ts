import { Component, effect, signal } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
selector: 'app-carousel',
standalone: true,
imports: [NgFor, NgClass, RouterModule],
templateUrl: './carousel.component.html',
styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {
images = [
'assets/cortes/salon1.jpg',
'assets/cortes/salon2.jpg',
'assets/cortes/salon3.jpg',
'assets/cortes/salon4.jpg',
'assets/cortes/salon5.jpg',
'assets/cortes/salon6.jpg',
'assets/cortes/salon7.jpg',
'assets/cortes/salon8.jpg'
];


index = signal(0);
intervalId?: any;


constructor(){
this.start();
// Pausa cuando no hay foco (mejora rendimiento)
effect(() => {
if (document.hidden) this.stop(); else this.start();
});
}


start(){ this.stop(); this.intervalId = setInterval(() => this.next(), 4500); }
stop(){ if (this.intervalId) clearInterval(this.intervalId); }


next(){ this.index.update(i => (i+1) % this.images.length); }
prev(){ this.index.update(i => (i-1+this.images.length) % this.images.length); }
go(i: number){ this.index.set(i); this.start(); }
}
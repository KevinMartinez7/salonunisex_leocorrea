import { Component, effect, signal } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';


@Component({
selector: 'app-carousel',
standalone: true,
imports: [NgFor, NgClass],
templateUrl: './carousel.component.html',
styles: [`
.slide { @apply absolute inset-0 transition-opacity duration-700 ease-in-out; }
.dot { @apply h-2 w-2 rounded-full border border-white; }
`]
})
export class CarouselComponent {
images = [
'assets/cortes/hero-1.jpg',
'assets/cortes/hero-2.jpg',
'assets/cortes/hero-3.jpg'
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
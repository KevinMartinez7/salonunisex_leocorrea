import { Component, effect, signal } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';


@Component({
selector: 'app-carousel',
standalone: true,
imports: [NgFor, NgClass],
styles: [`
.slide { @apply absolute inset-0 transition-opacity duration-700 ease-in-out; }
.dot { @apply h-2 w-2 rounded-full border border-white; }
`],
template: `
<div class="relative h-[65vh] md:h-[78vh] overflow-hidden">
<div class="absolute inset-0">
<ng-container *ngFor="let img of images; let i = index">
<img [src]="img" alt="corte" class="slide object-cover w-full h-full" [ngClass]="{ 'opacity-100': index()===i, 'opacity-0': index()!==i }" />
</ng-container>
</div>


<div class="absolute inset-0 bg-black/40"></div>


<div class="relative z-10 h-full container flex flex-col items-start justify-center gap-6">
<h1 class="text-3xl sm:text-5xl font-bold">Rudos con estilo</h1>
<p class="max-w-xl text-white/90">Barber & Unisex • Cortes clásicos y modernos, afeitado premium y cuidado del cabello.</p>
<div class="flex items-center gap-3">
<button class="btn bg-white text-black">Reservar turno</button>
<a routerLink="/galeria" class="btn">Ver estilos</a>
</div>
</div>


<!-- Controles -->
<div class="hidden sm:block">
  <button
    class="btn absolute left-4 top-1/2 -translate-y-1/2"
    (click)="prev()">‹
  </button>
</div>
<div class="hidden sm:block">
  <button
    class="btn absolute right-4 top-1/2 -translate-y-1/2"
    (click)="next()">›
  </button>
</div>


<!-- Dots -->
<div class="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2">
<button *ngFor="let _ of images; let i = index" class="dot" [ngClass]="{ 'bg-white': index()===i }" (click)="go(i)"></button>
</div>
</div>
`
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
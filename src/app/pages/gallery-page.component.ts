import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
selector: 'app-gallery-page',
standalone: true,
imports: [CommonModule],
template: `
 <div class="container mx-auto px-4 py-10">
 <h2 class="text-3xl font-bold text-center mb-8">Galería de Cortes</h2>
 <!-- Galería de imágenes -->
 <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
 <div *ngFor="let cut of cuts" class="relative group cursor-pointer" (click)="openModal(cut)">
 <img [src]="cut.image" [alt]="cut.title"
 class="rounded-2xl shadow-md transition-transform duration-300
group-hover:scale-105">
 <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60
text-white text-center py-2 rounded-b-2xl">
 {{ cut.title }}
 </div>
 </div>
 </div>
 <!-- Modal -->
 <div *ngIf="selectedCut" class="fixed inset-0 bg-black bg-opacity-80 flex
items-center justify-center z-50">
 <div class="relative max-w-3xl w-full p-4">
 <button class="absolute top-2 right-2 text-white
text-3xl" (click)="closeModal()">&times;</button>
 <img [src]="selectedCut.image" [alt]="selectedCut.title"
class="rounded-2xl w-full shadow-lg">
 <p class="text-white text-center mt-4 text-lg">{{ selectedCut.title }}
</p>
 </div>
 </div>
 </div>
 `,
styles: []
})
export class GalleryPageComponent {
cuts = [
{ title: 'Corte Clásico', image: 'assets/gallery/corte1.jpg' },
{ title: 'Fade Moderno', image: 'assets/gallery/corte2.jpg' },
{ title: 'Corte con Diseño', image: 'assets/gallery/corte3.jpg' },
{ title: 'Estilo Urbano', image: 'assets/gallery/corte4.jpg' },
{ title: 'Corte Ejecutivo', image: 'assets/gallery/corte5.jpg' },
{ title: 'Barba y Corte', image: 'assets/gallery/corte6.jpg' }
];
selectedCut: any = null;
openModal(cut: any) {
this.selectedCut = cut;
}
closeModal() {
this.selectedCut = null;
}
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
selector: 'app-gallery-page',
standalone: true,
imports: [CommonModule],
templateUrl: './gallery-page.component.html',
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

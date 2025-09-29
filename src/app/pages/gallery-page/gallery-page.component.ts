import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-page.component.html',
  styleUrls: ['./gallery-page.component.scss']
})
export class GalleryPageComponent {
  cuts = [
    { title: '', image: 'assets/gallery/corte7.jpg' },
    { title: '', image: 'assets/gallery/corte8.jpg' },
    { title: '', image: 'assets/gallery/corte9.jpg' },
    { title: '', image: 'assets/gallery/corte10.jpg' },
    { title: '', image: 'assets/gallery/corte11.jpg' },
    { title: '', image: 'assets/gallery/corte12.jpg' }
  ];

  selectedCut: any = null;

  openModal(cut: any) {
    this.selectedCut = cut;
    // Prevenir el scroll del body cuando el modal esté abierto
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.selectedCut = null;
    // Restaurar el scroll del body
    document.body.style.overflow = 'auto';
  }

  // Cerrar modal con tecla Escape
  @HostListener('document:keydown', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.selectedCut) {
      this.closeModal();
    }
  }
}

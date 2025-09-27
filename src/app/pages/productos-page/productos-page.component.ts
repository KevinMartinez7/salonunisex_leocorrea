import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos-page.component.html',
  styleUrls: ['./productos-page.component.scss']
})
export class ProductosPageComponent {
  products = [
    { title: 'Pomada Mate', image: 'assets/productos/producto1.jpg' },
    { title: 'Acondicionador con Keratina', image: 'assets/productos/producto2.jpg' },
    { title: 'Máscara capilar Keratina', image: 'assets/productos/producto3.jpg' },
    { title: 'Skin Anti-Age', image: 'assets/productos/producto4.jpg' },
    { title: 'Shampoo cremoso', image: 'assets/productos/producto5.jpg' },
    { title: 'NMáscara capilar Coco & Vainilla', image: 'assets/productos/producto6.jpg' }
  ];

  selectedProduct: any = null;

  openModal(product: any) {
    this.selectedProduct = product;
    // Prevenir el scroll del body cuando el modal esté abierto
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.selectedProduct = null;
    // Restaurar el scroll del body
    document.body.style.overflow = 'auto';
  }

  // Cerrar modal con tecla Escape
  @HostListener('document:keydown', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.selectedProduct) {
      this.closeModal();
    }
  }
}

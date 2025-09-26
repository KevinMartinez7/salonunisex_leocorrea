import { Component } from '@angular/core';
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
    { title: 'Pomada Mate', image: 'assets/productos/pomada-mate.jpg' },
    { title: 'Cera Brillante', image: 'assets/productos/cera-brillante.jpg' },
    { title: 'Shampoo para Barba', image: 'assets/productos/shampoo-barba.jpg' },
    { title: 'Aceite para Barba', image: 'assets/productos/aceite-barba.jpg' },
    { title: 'Peine Profesional', image: 'assets/productos/peine.jpg' },
    { title: 'Navaja Clásica', image: 'assets/productos/navaja.jpg' }
  ];

  selectedProduct: any = null;

  openModal(product: any) {
    this.selectedProduct = product;
  }

  closeModal() {
    this.selectedProduct = null;
  }
}

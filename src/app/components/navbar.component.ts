import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
<header class="fixed z-50 inset-x-0 top-0 bg-white/90 backdrop-blur-md border-b border-neutral-200 shadow-sm">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-center relative">

    <!-- Logo (izquierda) -->
    <a routerLink="/" class="flex items-center gap-2 absolute left-4">
      <img src="assets/logo3.png" alt="Logo" class="h-12 w-12 object-contain" />
      <span class="font-extrabold text-xl sm:text-2xl tracking-wide text-neutral-800">Leo Correa • Barber</span>
    </a>

    <!-- Links (centrados) -->
    <nav class="hidden md:flex items-center gap-8 text-lg font-semibold text-neutral-700">
      <a routerLink="/" class="relative group transform transition-all duration-300 hover:-translate-y-1 hover:scale-105">
        Inicio
        <span class="absolute left-0 -bottom-1 w-0 h-0.5 bg-brand.accent transition-all duration-300 group-hover:w-full"></span>
      </a>
      <a routerLink="/productos" class="relative group transform transition-all duration-300 hover:-translate-y-1 hover:scale-105">
        Productos
        <span class="absolute left-0 -bottom-1 w-0 h-0.5 bg-brand.accent transition-all duration-300 group-hover:w-full"></span>
      </a>
      <a routerLink="/contacto" class="relative group transform transition-all duration-300 hover:-translate-y-1 hover:scale-105">
        Contacto
        <span class="absolute left-0 -bottom-1 w-0 h-0.5 bg-brand.accent transition-all duration-300 group-hover:w-full"></span>
      </a>
    </nav>

    <!-- Botón reservar (derecha desktop) -->
    <a 
      routerLink="/contacto" 
      class="hidden sm:inline-flex items-center rounded-xl bg-neutral-900 text-white px-4 py-2 text-sm font-semibold shadow hover:bg-neutral-800 transition-colors absolute right-4"
    >
      Reservar
    </a>

    <!-- Botón hamburguesa mobile -->
    <button class="md:hidden p-2 rounded-md text-neutral-700 hover:text-neutral-900 absolute right-4 z-50" (click)="toggleMobileMenu()">
      <svg *ngIf="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
      <svg *ngIf="mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>

  </div>

  <!-- Menú mobile -->
  <div *ngIf="mobileMenuOpen" class="md:hidden bg-white border-t border-neutral-200 shadow-sm z-40">
    <nav class="flex flex-col gap-4 px-4 py-4 text-lg font-semibold text-neutral-700">
      <a routerLink="/" (click)="toggleMobileMenu()" class="hover:text-neutral-900 transition-transform transform hover:-translate-y-1 hover:scale-105">Inicio</a>
      <a routerLink="/productos" (click)="toggleMobileMenu()" class="hover:text-neutral-900 transition-transform transform hover:-translate-y-1 hover:scale-105">Productos</a>
      <a routerLink="/contacto" (click)="toggleMobileMenu()" class="hover:text-neutral-900 transition-transform transform hover:-translate-y-1 hover:scale-105">Contacto</a>
    </nav>
  </div>
</header>

  `
})
export class NavbarComponent {
  mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}

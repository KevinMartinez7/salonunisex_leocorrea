import { Component } from '@angular/core';


@Component({
selector: 'app-footer',
standalone: true,
template: `
<footer class="mt-20 border-t border-neutral-200 bg-neutral-900 text-white">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
    
    <!-- Contenido principal del footer -->
    <div class="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">

      <!-- Logo y copyright -->
      <div class="flex items-center gap-3">
        <img src="assets/logo3.png" alt="Logo" class="h-10 w-10 object-contain" />
        <span class="text-sm opacity-80">© {{year}} Leo Correa Barber • Rudos con estilo</span>
      </div>

      <!-- Redes sociales -->
      <div class="flex gap-4">
        <!-- Instagram -->
        <a href="https://www.instagram.com/salonunisex_leocorrea/" target="_blank" aria-label="Instagram">
          <svg class="h-6 w-6 fill-current text-white" viewBox="0 0 24 24">
            <path d="M7.75 2h8.5C19.35 2 22 4.65 22 7.75v8.5c0 3.1-2.65 5.75-5.75 5.75h-8.5C4.65 22 2 19.35 2 16.25v-8.5C2 4.65 4.65 2 7.75 2zm0 1.5C5.68 3.5 4 5.18 4 7.25v9.5C4 18.32 5.68 20 7.75 20h8.5C18.32 20 20 18.32 20 16.25v-9.5C20 5.68 18.32 3.5 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm4.75-.88a1.12 1.12 0 1 1 0 2.25 1.12 1.12 0 0 1 0-2.25z"/>
          </svg>
        </a>

        <!-- Facebook -->
        <a href="https://www.facebook.com/leo.correa.7161" target="_blank" aria-label="Facebook">
          <svg class="h-6 w-6 fill-current text-white" viewBox="0 0 24 24">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.79c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.61.77-1.61 1.56v1.88h2.74l-.44 2.89h-2.3v6.99C18.34 21.13 22 17 22 12z"/>
          </svg>
        </a>

        <!-- WhatsApp -->
        <a href="https://wa.me/5492494651747" target="_blank" aria-label="WhatsApp">
          <svg class="h-6 w-6 fill-current text-white" viewBox="0 0 24 24">
            <path d="M20.52 3.48A11.88 11.88 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.08 1.52 5.8L0 24l6.5-1.5A11.95 11.95 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.21-3.48-8.52zm-8.52 18c-1.85 0-3.64-.5-5.18-1.44l-.37-.22-3.86.9.82-3.77-.24-.38A9.02 9.02 0 0 1 3 12c0-4.97 4.03-9 9-9 2.41 0 4.67.94 6.36 2.64A8.93 8.93 0 0 1 21 12c0 4.97-4.03 9-9 9zm5.35-7.45c-.29-.15-1.71-.84-1.97-.93-.26-.1-.45-.15-.64.15s-.73.93-.9 1.12c-.17.19-.33.21-.61.07-.29-.15-1.23-.45-2.34-1.44-.87-.77-1.46-1.72-1.63-2-.17-.29-.02-.45.13-.6.13-.13.29-.33.44-.5.15-.17.2-.29.3-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.54-.88-2.12-.23-.56-.46-.48-.64-.49-.17-.01-.36-.01-.55-.01s-.5.07-.76.36c-.26.29-.99.97-.99 2.36 0 1.38 1.01 2.72 1.15 2.91.14.19 1.98 3.03 4.81 4.25.67.29 1.19.46 1.6.59.67.21 1.28.18 1.76.11.54-.08 1.71-.69 1.95-1.36.24-.66.24-1.23.17-1.36-.07-.13-.26-.21-.55-.36z"/>
          </svg>
        </a>
      </div>

    </div>

    <!-- Dirección -->
    <div class="border-t border-neutral-700 pt-6">
      <div class="flex items-center justify-center gap-2 text-neutral-300">
        <!-- Ícono de ubicación -->
        <svg class="h-5 w-5 fill-current text-blue-400" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <span class="text-sm">Arana 310, Tandil, Buenos Aires</span>
      </div>
    </div>

  </div>
</footer>

`
})
export class FooterComponent { year = new Date().getFullYear(); }
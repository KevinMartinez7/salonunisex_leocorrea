import { Component } from '@angular/core';
import { CarouselComponent } from './carousel.component';
import { ServicesStripComponent } from './services-strip.component';
import { GalleryPageComponent } from './gallery-page.component';
import { FooterComponent } from '../components/footer.component';


@Component({
selector: 'app-home-page',
standalone: true,
imports: [CarouselComponent, ServicesStripComponent, GalleryPageComponent],
template: `
<section class="bg-neutral-900 text-white">
<app-carousel />
</section>
<section class="container py-16">
<h2 class="text-3xl font-bold text-center mb-8">Servicios populares</h2>
<app-services-strip />
<app-gallery-page></app-gallery-page>
</section>
`
})
export class HomePageComponent {}
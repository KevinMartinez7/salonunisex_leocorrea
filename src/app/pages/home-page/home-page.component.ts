import { Component } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';
import { ServicesStripComponent } from '../services-strip/services-strip.component';
import { GalleryPageComponent } from '../gallery-page/gallery-page.component';
import { FooterComponent } from '../../components/footer.component';


@Component({
selector: 'app-home-page',
standalone: true,
imports: [CarouselComponent, ServicesStripComponent, GalleryPageComponent],
templateUrl: './home-page.component.html',
styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {}
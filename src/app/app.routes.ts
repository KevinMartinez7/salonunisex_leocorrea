import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page.component';
import { GalleryPageComponent } from './pages/gallery-page.component';
import { ContactPageComponent } from './pages/contacto.component';
import { ProductosPageComponent } from './pages/productos-page.component';



export const routes: Routes = [
{ path: '', component: HomePageComponent, title: 'Leo Correa Barber' },
{ path: 'productos', component: ProductosPageComponent, title: 'Productos' },
{ path: 'galeria', component: GalleryPageComponent, title: 'Galería de Cortes' },
{ path: 'contacto', component: ContactPageComponent, title: 'Contacto' },
{ path: '**', redirectTo: '' }
];

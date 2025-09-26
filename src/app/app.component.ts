import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


import { NavbarComponent } from './components/navbar.component';
import { FooterComponent } from './components/footer.component';


@Component({
selector: 'app-root',
standalone: true,
imports: [RouterOutlet, NavbarComponent, FooterComponent],
template: `
<app-navbar />
<main class="pt-20"> <!-- padding para navbar fixed -->
<router-outlet />
</main>
<app-footer />
`
})
export class AppComponent {}
import { Component } from '@angular/core';


@Component({
selector: 'app-services-strip',
standalone: true,
template: `
<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
<article class="card p-6 hover:shadow-lg transition">
<h3 class="font-semibold text-lg mb-2">Corte Clásico</h3>
<p class="text-sm opacity-80">Perfilado y acabado profesional.</p>
</article>
<article class="card p-6 hover:shadow-lg transition">
<h3 class="font-semibold text-lg mb-2">Fade / Degrade</h3>
<p class="text-sm opacity-80">De bajo a alto, transiciones limpias.</p>
</article>
<article class="card p-6 hover:shadow-lg transition">
<h3 class="font-semibold text-lg mb-2">Afeitado Premium</h3>
<p class="text-sm opacity-80">Toalla caliente y after shave.</p>
</article>
<article class="card p-6 hover:shadow-lg transition">
<h3 class="font-semibold text-lg mb-2">Unisex & Color</h3>
<p class="text-sm opacity-80">Cortes y colorimetría para todos.</p>
</article>
</div>
`
})
export class ServicesStripComponent {}
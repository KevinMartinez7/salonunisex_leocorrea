import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { BrowserModule } from '@angular/platform-browser';
import { App } from './app/app';

@NgModule({
  imports: [
    //BrowserModule.withServerTransition({ appId: 'leo-correa-barber' }),
    ServerModule,
  ],
  bootstrap: [App],
})
export class AppServerModule {}

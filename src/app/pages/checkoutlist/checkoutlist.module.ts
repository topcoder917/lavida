import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckoutlistPageRoutingModule } from './checkoutlist-routing.module';

import { CheckoutlistPage } from './checkoutlist.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckoutlistPageRoutingModule,
    ComponentsModule
  ],
  declarations: [CheckoutlistPage]
})
export class CheckoutlistPageModule {}

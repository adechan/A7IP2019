import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

// Import ionic-rating module
import { IonicRatingModule } from 'ionic4-rating';

import { MypackagesPage } from './mypackages.page';
import { ModalSelectAddressPageModule } from '../modal-select-address/modal-select-address.module';
import { ModalSelectAddressPage } from '../modal-select-address/modal-select-address.page';

const routes: Routes = [
  {
    path: '',
    component: MypackagesPage
  }
];


@NgModule({
  entryComponents: [
    ModalSelectAddressPage
  ],
  imports: [
    CommonModule,
    IonicRatingModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    ModalSelectAddressPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MypackagesPage]
})
export class MypackagesPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SettingsPage } from './settings.page';

import { ModalSelectAddressPageModule } from '../modal-select-address/modal-select-address.module';
import { ModalSelectAddressPage } from '../modal-select-address/modal-select-address.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage
  }
];

@NgModule({
  entryComponents: [
    ModalSelectAddressPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalSelectAddressPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule {}

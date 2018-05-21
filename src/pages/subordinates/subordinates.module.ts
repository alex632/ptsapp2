import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubordinatesPage } from './subordinates';

@NgModule({
  declarations: [
    SubordinatesPage,
  ],
  imports: [
    IonicPageModule.forChild(SubordinatesPage),
  ],
})
export class SubordinatesPageModule {}

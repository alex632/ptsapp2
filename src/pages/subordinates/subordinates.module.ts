import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { SubordinatesPage } from './subordinates';

@NgModule({
  declarations: [
    SubordinatesPage,
  ],
  imports: [
    IonicPageModule.forChild(SubordinatesPage),
    TranslateModule.forChild()
  ],
  exports: [
    SubordinatesPage
  ]
})
export class SubordinatesPageModule {}

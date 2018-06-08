import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { SubordinateReviewPage } from './subordinate-review';

@NgModule({
  declarations: [
    SubordinateReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(SubordinateReviewPage),
    TranslateModule.forChild()
  ],
})
export class SubordinateReviewPageModule {}

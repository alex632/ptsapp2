import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { MyTimesheetPage } from './my-timesheet';

@NgModule({
  declarations: [
    MyTimesheetPage,
  ],
  imports: [
    IonicPageModule.forChild(MyTimesheetPage),
    TranslateModule.forChild()
  ],
  exports: [
    MyTimesheetPage
  ]
})
export class MyTimesheetPageModule {}

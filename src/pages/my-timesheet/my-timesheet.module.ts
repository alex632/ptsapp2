import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyTimesheetPage } from './my-timesheet';

@NgModule({
  declarations: [
    MyTimesheetPage,
  ],
  imports: [
    IonicPageModule.forChild(MyTimesheetPage),
  ],
})
export class MyTimesheetPageModule {}

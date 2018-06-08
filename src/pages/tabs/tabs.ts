import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController } from 'ionic-angular';

//import { Tab1Root, Tab2Root } from '../';
import { Tab3Root } from '../';
import { SubordinatesPage } from '../subordinates/subordinates';
import { MyTimesheetPage } from '../my-timesheet/my-timesheet';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tabRootMyTSS: any = MyTimesheetPage;
  tabRootSubordinates: any = SubordinatesPage;
  tabTitleMyTSS = " ";
  tabTitleSubordinates = " ";

  //tab1Root: any = Tab1Root;
  //tab2Root: any = Tab2Root;
  tab3Root: any = Tab3Root;

  //tab1Title = " ";
  //tab2Title = " ";
  tab3Title = " ";

  constructor(public navCtrl: NavController, public translateService: TranslateService) {
    /*
    translateService.get(['TAB1_TITLE', 'TAB2_TITLE', 'TAB3_TITLE']).subscribe(values => {
      this.tab1Title = values['TAB1_TITLE'];
      this.tab2Title = values['TAB2_TITLE'];
      this.tab3Title = values['TAB3_TITLE'];
    });
    */
    translateService.get(['TAB_TITLE_MY_TIMESHEET', 'TAB_TITLE_REVIEW_TIMESHEET', 'TAB3_TITLE']).subscribe(values => {
      this.tabTitleMyTSS = values['TAB_TITLE_MY_TIMESHEET'];
      this.tabTitleSubordinates = values['TAB_TITLE_REVIEW_TIMESHEET'];
      this.tab3Title = values['TAB3_TITLE'];
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage'); //NOTE: refresh data here?
  }
}

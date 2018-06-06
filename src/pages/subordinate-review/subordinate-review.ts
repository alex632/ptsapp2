import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { SubordinatesProvider } from '../../providers/subordinates/subordinates';

/**
 * Generated class for the SubordinateReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-subordinate-review',
  templateUrl: 'subordinate-review.html',
  /* NOTE: tabs not suitable here!
  template: `
  <ion-tabs tabsPlacement="top" tabsLayout="icon-start" tabsHighlight="true">
    <ion-tab tabIcon="pie" tabTitle="Chart" [root]="tab1"></ion-tab>
    <ion-tab tabIcon="list" tabTitle="List" [root]="tab2"></ion-tab>
  </ion-tabs>`
  */
})
export class SubordinateReviewPage {
  //Object = Object;
  tsObj: any;
  timesheet: Array<any>;
  member: any;
  week: any;
  timeSheetStyle: string;
  //tab1 = 'ReviewChartPage';
  //tab2 = 'ReviewListPage';

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public subordinates: SubordinatesProvider) {
    this.member = navParams.get('member');
    this.week = navParams.get('week');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubordinateReviewPage');
    this.subordinates.getTimeSheet(this.member.id, this.week.start_date).subscribe(obj=>{
      this.tsObj = obj.data.task_data || {};
      console.log(`Got Timesheet @${obj.time}`, this.tsObj);
      this.timesheet = [];//new Array();
      for (let i of Object.keys(this.tsObj)) {
        this.timesheet.unshift(this.tsObj[i]);
      }
      //console.log(this.timesheet);
      //console.log(Object.keys(this.timesheet));
    });
    
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter SubordinateReviewPage');
    this.timeSheetStyle = 'chart';
  }

  refresh() {
    this.events.publish('refresh-timesheet', this.member.id, this.week.start_date);
  }

}

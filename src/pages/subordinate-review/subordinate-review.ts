import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { SubordinatesProvider } from '../../providers/subordinates/subordinates';

/**
 * 主管审视部属工时的页面
 * 
 * Generated class for the SubordinateReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-subordinate-review',
  templateUrl: 'subordinate-review.html',
})
export class SubordinateReviewPage {
  tsObj: any;
  timesheet: Array<any>;
  member: any;
  week: any;
  timeSheetStyle: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public subordinates: SubordinatesProvider) {
    this.member = navParams.get('member');
    this.week = navParams.get('week');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubordinateReviewPage');
    this.subordinates.getTimeSheet(this.member.id, this.week.start_date).subscribe(obj=>{
      this.tsObj = obj.data.task_data || {};
      console.log(`Got Timesheet @${obj.time}`, this.tsObj);
      this.timesheet = [];
      for (let i of Object.keys(this.tsObj)) {
        this.timesheet.unshift(this.tsObj[i]);
      }
    });
    
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter SubordinateReviewPage');
    this.timeSheetStyle = 'chart';
  }

  refresh() {
    this.events.publish('refresh-timesheet', this.member.id, this.week.start_date);
  }

  approve() {
    console.log("approve");
  }

  reject() {
    console.log("reject");
  }
}

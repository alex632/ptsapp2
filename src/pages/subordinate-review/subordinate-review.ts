import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
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
  //tsInfo: any;
  //tsObj: any;
  timesheet: Array<any>;
  member: any;
  week: any;
  timeSheetStyle: string;
  showApprove: boolean = false;
  showReject: boolean = false;
  showReturn: boolean = false;
  rejectReason: string = "";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public alertCtrl: AlertController,
    public subordinates: SubordinatesProvider) {
    this.member = navParams.get('member');
    this.week = navParams.get('week');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubordinateReviewPage');
    this.subordinates.getTimeSheet(this.member.id, this.week.start_date).subscribe(obj=>{
      //this.tsInfo = obj;
      let tsObj = obj.data.task_data || {};
      console.log(`Got Timesheet @${obj.time}`, obj);
      this.timesheet = [];
      for (let i of Object.keys(tsObj)) {
        this.timesheet.unshift(tsObj[i]);
      }
      //console.log(obj.data.show_approve, obj.data.show_reject, obj.data.show_return, obj.data.reject_reason);
      this.showApprove = obj.data.show_approve;
      this.showReject = obj.data.show_reject;
      this.showReturn = obj.data.show_return;
      this.rejectReason = obj.data.reject_reason;
    });
    
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter SubordinateReviewPage');
    this.timeSheetStyle = 'list';
  }

  refresh() {
    this.events.publish('refresh-timesheet', this.member.id, this.week.start_date);
  }

  approveTS() {
    this.subordinates.approveTimeSheet(this.member.id, this.week.start_date).subscribe(obj=>{
      console.log("approve TS");
      console.log(obj);
    });
  }

  rejectTS() {
    let prompt = this.alertCtrl.create({
      title: '殘忍拒絕',
      message: '為什麼你要拒絕部屬的工時？説明白講清楚！',
      inputs: [
        {
          name: 'reason',
          placeholder: '理由'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('rejct cancelled.');
          }
        },
        {
          text: 'Just do it',
          handler: data => {
            console.log('Just reject it.');
            console.log(data);
            this.subordinates.rejectTimeSheet(this.member.id, this.week.start_date, data.reason).subscribe(obj=>{
              console.log("reject TS");
              console.log(obj);
            });
          }
        }
      ]
    });
    prompt.present();
  }

  returnTS() {
    let prompt = this.alertCtrl.create({
      title: 'Return',
      message: '你确定吗？状态将改变为审核。',
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('return cancelled.');
          }
        },
        {
          text: 'OK',
          handler: data => {
            console.log('Just return it.');
            console.log(data);
            this.subordinates.returnTimeSheet(this.member.id, this.week.start_date).subscribe(obj=>{
              console.log("return TS");
              console.log(obj);
            });
          }
        }
      ]
    });
    prompt.present();
  }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SubordinateReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-review-chart',
  templateUrl: 'review-chart.html',
})
export class ReviewChartPage {
  //member: any;
  //week: any;
  member = {id:1234, user:{user_info:{dept_name:'MRSX00', name:'Somebody'}}};
  week = {start_date: new Date()};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    //this.member = navParams.get('member');
    //this.week = navParams.get('week');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewChartPage');
  }

}

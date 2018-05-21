import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SubordinatesProvider } from '../../providers/subordinates/subordinates';

/**
 * Generated class for the SubordinatesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-subordinates',
  templateUrl: 'subordinates.html',
})
export class SubordinatesPage {
  Object = Object;
  subHeads: Object = {};  // = {1:{user_info:{name:'Robot', dept_name:'joker'}}};
  subMembers: Object = {};
  subDepartments: Object = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public subordinates: SubordinatesProvider) {
  }

  /**
   * The view loaded, let's load the data from storage or Web server.
   */
  ionViewDidLoad() {
    function setWeekIcon(week) {
      if (week['status']==='Review') {
        week['img'] = 'assets/img/bullet-blue.png';
        week['icon'] = 'happy';
        week['color'] = 'blue';
      } else if (week['status']==='Draft') {
        week['img'] = 'assets/img/bullet-yellow.png';
        week['icon'] = 'happy';     //'information-circle';
        week['color'] = "#FFC104";  // yellow
      } else {
        week['img'] = 'assets/img/bullet-grey.png';
        week['icon'] = 'sad';
        week['color'] = 'grey';
      }
    }
    function setAllWeeksIcon(people) {
      for (let uid in people) {
        //people[uid]['data'] = people[uid]['data'].slice(5);   // reduce 10 to 5
        for (let week of people[uid]['data']) {
          setWeekIcon(week);
        }
      }
    }
    console.log('ionViewDidLoad SubordinatesPage');
    this.subordinates.getMembers().then(resp=>{
      this.subMembers = resp;
      setAllWeeksIcon(this.subMembers);
    });
    this.subordinates.getSubHeads().then(resp=>{
      this.subHeads = resp;
      setAllWeeksIcon(this.subHeads);
    });
  }

  openWeek(week) {
    console.log('week', week);
  }
}

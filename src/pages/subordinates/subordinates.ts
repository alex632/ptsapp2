import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ImageLoader } from 'ionic-image-loader';
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
  deptId: number;
  myMembersInfo: any;
  myMembers: Array<any>;
  subHeadsInfo: any;
  subHeads: Array<any>;
  showSubHeads: boolean = false;
  subDepartments: any;
  showSubDepartments: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, private imageLoader: ImageLoader, public subordinates: SubordinatesProvider) {
    this.deptId = navParams.get('deptId');
    console.log(`SubordinatesPage constructor deptId=${this.deptId}`);
  }

  /**
   * The view loaded, let's load the data from storage or Web server.
   */
  ionViewDidLoad() {

    function setWeekIcon(week) {
      if (week['status']==='Review') {
        week['img'] = 'assets/img/bullet-blue.png';
        week['icon'] = 'happy';
        week['color'] = 'cyan';
      } else if (week['status']==='Draft') {
        week['img'] = 'assets/img/bullet-yellow.png';
        week['icon'] = 'happy';     //'information-circle';
        week['color'] = "#FFC104";  // yellow
      } else if (week['status']==='Approve') {
        week['img'] = 'assets/img/bullet-green.png';
        week['icon'] = 'happy';     //'information-circle';
        week['color'] = "rgb(143, 252, 0)"; //"#00FFFF";
      } else if (week['status']==='Reject') {
        week['img'] = 'assets/img/bullet-red.png';
        week['icon'] = 'sad';     //'information-circle';
        week['color'] = "red";
      } else {
        week['img'] = 'assets/img/bullet-grey.png';
        week['icon'] = 'sad';
        week['color'] = 'grey';
      }
    }
    function setAllWeeksIcon(people) {
      for (let usr of people) {
        for (let week of usr.user.data) {
          setWeekIcon(week);
        }
      }
    }

    console.log(`ionViewDidLoad SubordinatesPage deptId=${this.deptId}`);
    
    this.subordinates.getMembers(this.deptId).subscribe(obj=>{
      this.myMembersInfo = obj;
      this.myMembers = this.myMembersInfo.data.members;
      setAllWeeksIcon(this.myMembers);
      console.log('membersInfo', this.myMembersInfo);
    });
    this.subordinates.getSubHeads(this.deptId).subscribe(obj=>{
      this.subHeadsInfo = obj;
      this.subHeads = this.subHeadsInfo.data.members;
      setAllWeeksIcon(this.subHeads);
      //console.warn('this.subHeads.length=', this.subHeads.length);
      this.showSubHeads = this.subHeads.length > 0;
      console.log('subHeadsInfo', this.subHeadsInfo);
    });
    this.subordinates.getSubDepartments(this.deptId).share().subscribe(obj => {
      this.subDepartments = obj;
      this.showSubDepartments = this.subDepartments.data.length > 0;
      console.log('subDepartments', this.subDepartments);
    });
  }

  ionViewDidEnter() {
    console.log(`ionViewDidEnter SubordinatesPage deptId=${this.deptId}`);
  }

  ionViewWillLeave() {
    console.log(`ionViewWillLeave SubordinatesPage deptId=${this.deptId}`);
  }

  refresh() {
    this.events.publish('subordinates-refresh');
  }

  openWeek(week, member) {
    //console.log('week', week, member);
    this.navCtrl.push('SubordinateReviewPage', {
      member: member,
      week: week
    });
  }

  openDept(dept) {
    //console.log('Enter dept', dept);
    this.navCtrl.push('SubordinatesPage', {
      deptId: dept.id
    });
  }

  // Tried to use ionic-image-loader 5.0.2, but got a lot of problems. Damn poor quality and performance.
  /*
    CORS problem.
    Someone said ionic-image-loader 4.2.1 should be used instead of 5.0.2, but it cannot solve CORS issues.
    So I used 5.0.2 and made a little change:
    this.http.get(currentItem.imageUrl, {
        responseType: 'blob',
    **  withCredentials: true,
        headers: this.config.httpHeaders,
    })
    Looks workable but afer clearCache(), will get a lot of ["ImageLoader Error: ",{"code":12,"message":"PATH_EXISTS_ERR"}]
    and many image file not saved.
  
  clearCache(refresher) {
    this.imageLoader.clearCache();
    refresher.complete();
    console.warn('Clear Image Cache');
  }

  onImageLoad(event) {
    console.log('image ready: ', event);
    console.warn(event);
    // error JSON.stringify()ing argument: TypeError: JSON.stringify cannot serialize cyclic structures.
  }
  */
}

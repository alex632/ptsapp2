import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, LoadingController, AlertController } from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '../';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  account: { user: string, password: string } = {
    user: '',
    password: ''
  };

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public translateService: TranslateService) {

    // Should getCredential() be in here or in ionViewDidLoad or ionViewDidEnter?
    // No matter where, it would be done twice. Don't konw why!
    user.getCredential().then(cred=>{
      this.account.user = cred.user;
      this.account.password = cred.password;
      console.log('LoginPage constructor: Load cred', cred);
    });
  }

  // Attempt to login in through our User service
  doLogin() {
    if (!this.account.user || !this.account.password){
      let alert = this.alertCtrl.create({
        title: 'Error', //NOTE: should use translateService.get
        subTitle: 'Employee ID and password cannot be empty.',  //NOTE: should use translateService.get
        buttons: ['OK'] //NOTE: should use translateService.get
      });
      alert.present();
      return;
    }
    
    let loader = this.loadingCtrl.create({
      content: "Please wait...",  //NOTE: should use translateService.get
      duration: 33000
    });
    loader.present();
    
    this.user.login(this.account).subscribe((resp) => {
      loader.dismiss();
      if (resp=='OK') {
        this.navCtrl.push(MainPage);
      } else if (resp=='NG') {
        this.translateService.get('LOGIN_ERROR').subscribe((value) => {
          let toast = this.toastCtrl.create({
            message: value,
            duration: 4000,
            position: 'top'
          });
          toast.present();
        })
      } else {
        let toast = this.toastCtrl.create({
          message: 'It may be network error.',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    });
  }
}

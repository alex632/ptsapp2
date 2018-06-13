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

    user.getCredential().then(cred=>{
      this.account.user = cred.user;
      this.account.password = cred.password;
      console.log('LoginPage constructor: Load cred');
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
      duration: 13000
    });
    loader.present();
    
    this.user.login(this.account).subscribe((resp) => {
      loader.dismiss();
      if (resp=='OK') {
        //this.navCtrl.push('TabsPage');
        let alert = this.alertCtrl.create({
          title: 'Login OK',
          message: 'Jump to main page?',
          buttons: [
            {
              text:'OK',
              handler: () => {
                this.navCtrl.push('TabsPage');
                console.log('Cancel clicked');
              }
            },
            {
              text:'Nop',
              handler: () => {}
            }
          ]
        });
        alert.present();
        //this.navCtrl.setRoot('TabsPage');
      } else /*if (resp=='NG')*/ {
        //resp.error.text === 'RELOAD'  // You've been blocked. // You can't login system within minutes!
        this.translateService.get('LOGIN_ERROR').subscribe((value) => {
          let toast = this.toastCtrl.create({
            //title: value,
            message: `${resp.headers.get('content-length')} ${resp.error.text}`,
            duration: 8000,
            position: 'top'
          });
          toast.present();
        })
      }/* else if (resp=='ERROR') {
        let toast = this.toastCtrl.create({
          message: 'It may be network error.',
          duration: 1000,
          position: 'top'
        });
        toast.present();
      } else {

      }*/
    });
  }
}

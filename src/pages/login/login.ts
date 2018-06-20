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
      console.log('LoginPage constructor: get credential from storage.');
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
      loader.dismiss().then(()=>{
        console.log("I'm in login response.");
        console.log(resp);
      
        //this.navCtrl.push('TabsPage');
        if (resp.status=='OK') {
          let alert = this.alertCtrl.create({
            title: 'Login OK',
            message: 'Jump to main page?',
            buttons: [
              {
                text:'OK',
                handler: () => {
                  this.navCtrl.push(MainPage);
                  console.log('OK clicked');
                }
              },
              {
                text:'Nop',
                handler: () => {}
              }
            ]
          });
          alert.present();
        } else if (resp.status=='ERROR') {
          let toast = this.toastCtrl.create({
            message: 'Unknown error occurred. It may be network issues.',
            duration: 12000,
            showCloseButton: true,
            position: 'top'
          });
          toast.present();
        } else if (resp.status=='NG') {
          //resp.error.text === 'RELOAD'  // You've been blocked. // You can't login system within minutes!
          this.translateService.get('LOGIN_ERROR').subscribe((value) => {
            let toast = this.toastCtrl.create({
              message: `${resp.reason}`,
              duration: 12000,
              showCloseButton: true, 
              position: 'top'
            });
            toast.present();
          })
        }
      });
    });
  }
}

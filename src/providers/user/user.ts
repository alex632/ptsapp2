//import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';  //NOTE: I need HTTP response headers that api provider can't give me.
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

import { Api } from '../api/api';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }Ø
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _user: any;

  constructor(public api: Api, public http: HttpClient, public storage: Storage) { }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  //NOTE: to be deleted.
  login_old(accountInfo: any) { //NOTE: to be deleted.
    let seq = this.api.post('login', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
        this._loggedIn(res);
      } else {
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  private keyStorage = '$Credential$';
  /*
    Generate a private key for JSEncrypt.
    $ openssl genrsa -out rsa_1024_priv.pem 1024
    Get the corresponding public key:
    $ openssl rsa -pubout -in rsa_1024_priv.pem -out rsa_1024_pub.pem
   */
  private privateKey =
    "MIICXgIBAAKBgQDlmvU/tehsFNDPbnx8M28JxwsbPV0hNxDMFT2xCy2lEm5cDGBf"+
    "4YLvVB6XNY/jg4u27I3ad9CkPqXJQY0Ramn02zT4rYfts++DzY8cPZwLSAMm1q+8"+
    "UrFb80/Bc/S7UrcxGPNkw43+7s4bxSZW4JkezulO+JDWvQHynNu4rW5xUQIDAQAB"+
    "AoGAPmD8EkQMkhiRpllhDqk2mJRwCwV/4L9CHAAFU60yyG8adn2STVpKJVVYPkJ6"+
    "Bhi+A4N/AoSctZKjnermNX4QrMZsDCgId6ts4jS/AUWWC0IVcNh5h55SM2ghEyb8"+
    "9NC1fxuBlfcLgedrdTHO6u9yofNwgQZzBK+40zS6s8JbjRUCQQD8sE/M1Ee3olyx"+
    "VrJJND3EnGIAawIBqjY5iQMjFxAQBZ7ypWVxYM8eVUKUBgLR/Ppb7JG9viib6M00"+
    "URELqLw3AkEA6J01fkaGFRTA1KEdNf5I9fg0Be0UCYsODgY/Nq6ZKdgQOumpN3Do"+
    "ZmLXXLChJYUwe4VwONLk11xOhXxe1dhKtwJBAIwWfxcydNQUmkjipJK6+KeAf0B2"+
    "ErWzlL5O/EM+7PPE+frRwSybHBhX8kI4FuYt1uqRe7byrnbJGMKxUr7g+/8CQQCc"+
    "A/VBAKQlt4muE3G4KRlegF7EKsLps651kZMMZgasnhIksVuhp8T4BwtTS9SJic9+"+
    "yXz/X9PE7lBsD4K8Axn5AkEA2iqw5/AELzd4o0v2BJBdN4WluqPqRJv68BmA11b6"+
    "n+m1fsHE6w+n9PU7kvkLnaZOoTXPNu94/TUPR+xDzUIIMA=="

  login(accountInfo: any) {

    const body = new HttpParams()
      .set('account', accountInfo.user)
      .set('password', accountInfo.password);

    //NOTE: Login to PRD for retrieving avatars because test servers don't have them. Should remove later.
    /*
    this.http.post('https://pts.wistron.com/~pts/model/public_service.php?action=check_login',
      body.toString(),
      {
        observe: 'response',  // get http headers
        withCredentials: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }
    ).subscribe((res: any) => {
        console.log('Login to PRD succeeded.', res);
    }, err => {
        console.error('Login to PRD ERROR.', err);
        console.error(err);
    });
    */

    return Observable.create(observer => {

      this.http.post('http://10.43.146.37/~pts/model/public_service.php?action=check_login',
        body.toString(),
        {
          //observe: 'response',  // get http headers
          //responseType: "text",
          withCredentials: true,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }
      ).subscribe((res: any) => {
        // JSON result obtained including empty. It's empty in this case.
        // On iOS, it looks like only 'Content-Type' gettable. Others such as 'Content-Length', 'Server', 'X-Powered-By' all null.
        // console.log(res.headers.get('Set-Cookie'));     // null, Cookie not gettable on Chrome or iOS.
        console.log('Login succeeded.', res);
        this.setCredential(accountInfo).then(()=>{
          console.log('setCredential done');
          observer.next({status:'OK'});            
          this.getMyUID();
          //observer.complete();
        });
        /*
        if (res.status == 'success') {
          this._loggedIn(res);
          console.log(res);
        } else {
          console.log('Login failed.', res);
        }
        */
      }, (err: HttpErrorResponse) => {   // Unable to get a response of JSON format
        console.error('Login failed.', err);
        //console.error('Login failed.', err.error.text);
        console.log(err);
        if (err.status == 200) {
          observer.next({status:'NG', reason: err.error.text}); // Definite error: username/password wrong or locked.
        } else {
          // Maybe network errror
          observer.next({status: 'ERROR'});
        }
      });
    });

  }

  getMyUID() {
    this.api.get('/~pts/subsystem/tss/web_pages/application/iframe/my_task_table.php', {'webmode': 'j'})
    .subscribe(resp=>{
      console.log(resp);
      let uid = resp['user_id'];
      console.log("My UID:", uid);
      this.storage.set('$MyUID$', uid).then(()=>{
        console.log("set done, so what?");
      });
    });
  }

  getCredential() {
    return this.storage.get(this.keyStorage).then(cred=>{
      if (!cred) {
        return {user: '', password: ''};
      }
      let crypt = new JSEncrypt();
      crypt.setKey(this.privateKey);
      return JSON.parse(crypt.decrypt(cred));
    });
  }

  setCredential(accountInfo) {
    let crypt = new JSEncrypt();
    crypt.setKey(this.privateKey);
    return this.storage.set(this.keyStorage, crypt.encrypt(JSON.stringify(accountInfo)));
  }
  
  //NOTE: to delete...
  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('signup', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.user;
  }
}

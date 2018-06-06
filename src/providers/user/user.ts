//import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpParams } from '@angular/common/http';  //NOTE: I need HTTP response headers that api provider can't give me.
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
    /*
    "MIICXQIBAAKBgQDbAQJk9w6OWSH9B73hGwYbAmBqPyWWpK1LQmCO3e/KLqMwgWfR"+
    "dUY/7CDN4A6hQJb2wO6G9yOcaJibnCsmMdlKZogbPO5FhXzTzx3VvYyUMiCW+uIT"+
    "jgqwoYHmGVISxX/qskUo5dSdF0dZoitgr0NRFel8wFZn65bZJzI8qQY75wIDAQAB"+
    "AoGASsAIci/FXx7bNANNcyUHK3bfM8SD7uwcXiC01m64JtlOSAMTTXHq3WyaMcr1"+
    "E2L5ZBWsFJMMK5mj5REjxTCkile3aWhOPC8UvIAm/n5UmcpLZs+CZz3JyMC8o4s5"+
    "FpgRwEK9QEulyvxK9EbL6qQhpbv+6+r32XrCrqWRjeujLHkCQQD24XwnkHeX/+YO"+
    "dFgBmcZ9OrELcILNfTVZ9VqCX+wTms7mzaoEYe0o0OQVp49bAO2fl3AeRoR/3xZw"+
    "3Ab6OyqTAkEA4xfrbq7Em7rkv0KcJlK6rP/Lsb6OCaLpJrvAEFdJmTpyHUbp6PFt"+
    "RE7VBWCKf8d0RzJE6v0Oo6rtP42MnMF53QJBAJG0nMjg+6Rq9EU9px8yubH5LLp6"+
    "qchLiGxSYRunLzaW3Fvdr+UsQoMfXi3lmbb1Akl5YEOODO9HJABx63BN8R8CQQCS"+
    "pM+TGag8J+Ou3gSXerSxIj0W+kYeUuTb7kGIS9Vq7SLjZPeHRN+aTI2ie0T0Xofn"+
    "sb5vQBpD9gxeDbnPP+DBAkAya+MHoMjX2wAppySWtp511td35YfFf4AXxrRdFHf2"+
    "sjfaBeQfblwzuVnpNzNy8k8vuhbpxGDEPjBPTxreJ9+B";
    */
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
    this.http.post('https://pts.wistron.com/~pts/model/public_service.php?action=check_login',
      body.toString(),
      {
        observe: 'response',  // get http headers
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }
    ).subscribe((res: any) => {
      if (res.headers.get('Content-Length')==='0') {
        console.log('Login to PRD succeeded.', res);
      } else {
        console.log('Login to PRD failed.', res);
      }
    }, err => {
        console.error('Login to PRD ERROR', err);
    });

    return Observable.create(observer => {
      this.http.post('http://10.43.146.37/~pts/model/public_service.php?action=check_login',
        body.toString(),
        {
          observe: 'response',  // get http headers
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }
      ).subscribe((res: any) => {
        // Response text can be formed as an object {}
        // If the API returned a successful response, mark the user as logged in
        //console.log(res.headers.get('Set-Cookie'));     // null, Cookie not gettable!
        //console.log(res.headers.get('Content-Length')); // Expect: 0
        //console.log(res.headers.get('Content-Type'));   // Expect: text/html; charset=UTF-8
        if (res.headers.get('Content-Length')==='0') {
          console.log('Login succeeded.', res);
          observer.next('OK');
          this.setCredential(accountInfo);
        } else {
          console.log('Login failed.', res);
          observer.next('NG');
        }
        observer.complete();
        /*
        if (res.status == 'success') {
          this._loggedIn(res);
          console.log(res);
        } else {
          console.log('Login failed.', res);
        }
        */
      }, err => {   // Unable to get a response of json format
        if (err.status == '200') {
          // Definite error: username/password wrong
          observer.next('NG');
        } else {
          // Maybe network errror
          observer.next('ERROR');
        }
        //console.error('Login ERROR', err);
        //console.error('err.error.text', err.error.text);
        observer.complete();
      });
    });

    //return seq;
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
  
  getInfoTest() {
    // Get Fibby's info.
    let seq = this.http.get('http://10.43.146.38/~pts/subsystem/tss/web_pages/application/subordinate_review.php?format=json&date=2018-04-23&user_id=1497302818314666');
    seq.subscribe((res: any) => {
      console.log(res);
    });
  }
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

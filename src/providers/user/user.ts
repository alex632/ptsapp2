import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpParams } from '@angular/common/http';  //NOTE: I need HTTP response headers that api provider can't give me.
import { Injectable } from '@angular/core';

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

  constructor(public api: Api, public http: HttpClient) { }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login_old(accountInfo: any) {
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

  login(accountInfo: any) {
    const body = new HttpParams()
      .set('account', accountInfo.email)
      .set('password', accountInfo.password);

    //NOTE: Login to PRD for retrieving avatars because test servers don't have them. Should remove later.
    this.http.post('https://pts.wistron.com/~pts/model/public_service.php?action=check_login',
      body.toString(),
      {
        observe: 'response',  // get http headers
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }
    ).subscribe((res: any) => {
      if (res.status == 'success') {
        console.log('Login to PRD succeeded.');
      } else {
        console.log('Login to PRD failed.');
      }
    });

    let seq = this.http.post('http://10.43.146.38/~pts/model/public_service.php?action=check_login',
      body.toString(),
      {
        observe: 'response',  // get http headers
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }
    ).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      //console.log(res.headers.get('Set-Cookie'));     // null, why?
      //console.log(res.headers.get('Content-Length')); // Expect: 0
      //console.log(res.headers.get('Content-Type'));   // Expect: text/html; charset=UTF-8
      if (res.status == 'success') {
        this._loggedIn(res);
        console.log(res);
      } else {
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
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

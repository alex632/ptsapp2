import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  //url: string = 'https://example.com/api/v1';
  url: string = 'http://10.43.146.37';  //NOTE: should get from settings.

  constructor(public http: HttpClient) {
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        withCredentials: true,
        params: new HttpParams()
      };
    } else {
      reqOpts.withCredentials = true; // Track cookies
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }

    return this.http.get(this.url + endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {};
    }

    reqOpts.withCredentials = true; // Track cookies
    reqOpts.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    let b = new HttpParams();
    for (let k in body) {
      b = b.set(k, body[k]);
    }

    return this.http.post(this.url + endpoint, b.toString(), reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.url + '/' + endpoint, body, reqOpts);
  }
}

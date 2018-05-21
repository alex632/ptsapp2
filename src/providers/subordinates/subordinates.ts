import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Api } from '../api/api';

/*
  Generated class for the SubordinatesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SubordinatesProvider {
  private MEMBERS_STORAGE_KEY: string = '_myMembers';
  private SUBHEADS_STORAGE_KEY: string = '_mySubHeads';
  //private SUBDEPARTMENTS_STORAGE_KEY: string = '_mySubDepartments';

  constructor(public api: Api, public storage: Storage) {
    //console.log('Hello SubordinatesProvider Provider');
  }

  getPeople(storage_key, kind) {
    return new Promise((resolve, reject) => {
      // 當非同步作業成功時，呼叫 resolve(...),而失敗時則呼叫 reject(...)。
      this.storage.get(storage_key).then((people) => {
        if (people) {
          resolve(people);
        } else {
          this.api.get('/~pts/subsystem/tss/web_pages/application/subordinate.php', {
            'webmode': 'j', 'action': 'my_department_member_table', 'type': kind
          }).subscribe(resp=>{
            let heads = resp['lower_list'][kind];
            this.storage.set(storage_key, heads).then(() => {
              resolve(heads);
            });
          });
        }
      });
    });
  }

  getMembers() {
    return this.getPeople(this.MEMBERS_STORAGE_KEY, 'member');
  }

  getSubHeads() {
    return this.getPeople(this.SUBHEADS_STORAGE_KEY, 'dept_head');
  }

  getSubDepartments() {
    
  }
}

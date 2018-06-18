import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Api } from '../api/api';
import { Observable } from 'rxjs/Observable';
import { Events } from 'ionic-angular';

/*
  Generated class for the SubordinatesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SubordinatesProvider {
  //private MEMBERS_STORAGE_KEY: string = '_myMembers';
  //private SUBHEADS_STORAGE_KEY: string = '_mySubHeads';
  //private SUBDEPARTMENTS_STORAGE_KEY: string = '_mySubDepartments';
  private refreshEvent: string = 'subordinates-refresh';

  constructor(public api: Api, public storage: Storage, public events: Events) {
    //console.log('Hello SubordinatesProvider Provider');
  }

  /*
    Data format of members information:
      {
        time: '2018-05-24 09:15:01',  // when the data obtained from server
        data: {
          duration: [
            { start: "04-23", end: "04-29", year: "2018" },
            { start: "04-30", end: "05-06", year: "2018" },
            { start: "05-07", end: "05-13", year: "2018" },
            { start: "05-14", end: "05-20", year: "2018" },
            { start: "05-21", end: "05-27", year: "2018" }
          ],
          members: [      // sorted by department name instead of user id in ascending order
            { id: '864',  // user id
              user: {
                user_info: { name: "Pony Lin", dept_name: "MRS100", role: "dept_head", note: "Department Head", department_entry_date: "2006-07-01 00:00:00" },
                data: [
                  { start_date: "2018-04-23", status: null },
                  { start_date: "2018-04-30", status: "Review" },
                  { start_date: "2018-05-07", status: "Draft" },
                  { start_date: "2018-05-14", status: "Approve" },
                  { start_date: "2018-05-21", status: "Reject" }
                ]
              }
            },
            { id: '3180', user: { user_info: {name: "Jack C Zhang", dept_name: "MRS600", ...}, data:[...]}},
            ...
          ]
        }
      }
   */
  getPeople(storage_key, kind, deptId) {

    let refresh = (storage_key, kind, deptId) => {
      return new Promise((resolve, reject) => {
        // 當非同步作業成功時，呼叫 resolve(...),而失敗時則呼叫 reject(...)。
        let param = {
          'webmode': 'j', 'action': 'my_department_member_table', 'type': kind
        };
        if (deptId) {
          param['dept_id'] = deptId;
        }
        this.api.get('/~pts/subsystem/tss/web_pages/application/subordinate.php', param).subscribe(resp=>{
          console.log("Process the data given by server");
          // Process the data given by server
          let d0 : Array<any> = resp["weekly_data"];  //NOTE:  Must be an array. What if error?
          let du = [];
          // Keep only the last 5
          for (let j=4, i=d0.length-1; j>=0 && i>=0; j--,i--) {
            du[j] = {start: d0[i]["start"], end: d0[i]["end"], year: d0[i]["this_year"]}
          }
          let obj = resp['lower_list'][kind]; //NOTE: What if error? Could be null. "dept_head":null
          let mary = [];  // Member Array Ha!
          for (let uid in obj) {  // Iterate elements of the object in ascending order of key.
            let m = {id: uid, user: {user_info: obj[uid].user_info, data: []}};
            let d0 : Array<any> = obj[uid].data; //NOTE:  Must be an array. What if error?
            // Keep only the last 5
            for (let j=4, i=d0.length-1; j>=0 && i>=0; j--,i--) {
              m.user.data[j] = {start_date: d0[i].start_date, status: d0[i].status};
            }
            mary.push(m);
          }
          mary.sort((a,b)=>{ // Sort the array by department name in ascending order
            // Sort by dept_name then name
            if (a.user.user_info.dept_name < b.user.user_info.dept_name)
              return -1;
            if (a.user.user_info.dept_name > b.user.user_info.dept_name)
              return 1;
            /*
            if (a.user.user_info.name < b.user.user_info.name)
              return -1;
            if (a.user.user_info.name > b.user.user_info.name)
              return 1;
            */
            return 0;
          });
          let info = {time: new Date(), data: {duration: du, members:mary}};
          this.storage.set(storage_key, info).then(() => {
            resolve(info);
          });
          console.log(`Got ${storage_key} from server`, info.time, info);
        }, err=>{
          console.log(`Get ${storage_key} from server ERROR`, err);
          console.error(err);
        });
      });
    };

    return Observable.create(observer => {

      this.events.subscribe(this.refreshEvent, () => {
        console.log(`Refresh ${storage_key} at ${new Date()}`);
        refresh(storage_key, kind, deptId).then((obj) => {
          observer.next(obj);
        });
      });

      //
      // Return the data already in storage.
      // If not yet stored then get it from server.
      //
      this.storage.get(storage_key).then((obj) => {
        if (obj && obj.time && obj.data && obj.data.duration && obj.data.members) {
          //console.log(`get ${kind} HIT`);
          observer.next(obj); // return data to consumer
          //refresh();  //NOTE: refresh now?
        } else {
          //console.log(`get ${kind} MISS`);
          refresh(storage_key, kind, deptId).then((obj) => {
            observer.next(obj);  // return data to consumer
          });
        }
      });
    });
  }

  // 获取我的 直属的部门成员
  getMembers(deptId) {
    let storageKey = "members-0";  // Direct Department Members
    if (deptId) {
      storageKey = `members-${deptId}`;  // Sub Department Members
    }
    return this.getPeople(storageKey, 'member', deptId);
  }

  // 获取我的 直属的部门主管
  getSubHeads(deptId) {
    /* NOTE: when to clear storage except _settings ?
    this.storage.forEach( (value, key, index) => {
      console.log("This is the value", value);
      console.log("from the key", key);
      console.log("Index is", index);
    });
    */
    let storageKey = "subHeads-0";  // Direct Department Heads
    if (deptId) {
      storageKey = `subHeads-${deptId}`;  // Sub Department Members
    }
    return this.getPeople(storageKey, 'dept_head', deptId);
  }

  /* 获取我的 下属部门
    Data format of sub-departments information:
      {
        time: '2018-05-24 09:15:01',  // when the data obtained from server
        data: [     // sorted by department name instead of department id in ascending order
          {id: '317', name: 'MRS100', managerId: '864'},
          {id: '137', name: 'MRS600', managerId: '3180'}          
        ],
        review_data_count: 22
      }
   */
  getSubDepartments(deptId) {
    let storageKey = "subDepts-0";  // Direct Sub Departments
    if (deptId) {
      storageKey = `subDepts-${deptId}`;  // Sub Sub Departments
    }

    let refresh = (storageKey, deptId) => {
      return new Promise((resolve, reject) => {
        let param = {
          'webmode': 'j'
        };
        if (deptId) {
          param['dept_id'] = deptId;
        }
        this.api.get('/~pts/subsystem/tss/web_pages/application/subordinate.php', param).subscribe(resp=>{
          let depts = resp['my_management_dept']; //NOTE: Could be null
          /*
            Format of depts :
            {
              "317":{"dept_name":"MRS100","dept_manage":864,"note":"Department Head"},
              "137":{"dept_name":"MRS600","dept_manage":3180,"note":"Department Head"},
            }
          */
          let ary = [];
          for (let did in depts) {  // Iterate elements of the object in ascending order of key.
            if (depts[did].dept_manage)
              ary.push({id: did, name: depts[did].dept_name, managerId: depts[did].dept_manage});
          }
          ary.sort((a,b)=>{ // Sort the array by department name in ascending order
            if (a.name < b.name)
              return -1;
            if (a.name > b.name)
              return 1;
            return 0;
          });
          let info = {time: new Date(), data: ary, review_data_count: resp['review_data_count']};
          this.storage.set(storageKey, info).then(() => {
            resolve(info);
          });
          console.log(`Got ${storageKey} from server`, info.time, info);
        }, err=>{
          //NOTE: Doesn't handle network error yet!
          console.log(`Got ${storageKey} from server ERROR`);
        });
      });
    };
    /*
    return new Promise((resolve, reject) => {
      this.storage.get(this.SUBDEPARTMENTS_STORAGE_KEY).then((obj) => {
        if (obj && obj.time) {
          console.log('getSubDepartments HIT');
          resolve(obj);
          refresh();  //NOTE: No then() workable?
        } else {
          console.log('getSubDepartments MISS');
          refresh().then((obj) => {
            resolve(obj);
          });
        }
      });
    });
    */

    return Observable.create(observer => {

      this.events.subscribe(this.refreshEvent, () => {
        console.log(`Refresh ${storageKey} at ${new Date()}`);
        refresh(storageKey, deptId).then((obj) => {
          observer.next(obj);
        });
      });

      this.storage.get(storageKey).then((obj) => {
        if (obj && obj.time && obj.data && obj.review_data_count) {
          //console.log('getSubDepartments HIT');
          observer.next(obj);
          //refresh();  //NOTE: refresh now?
        } else {
          //console.log('getSubDepartments MISS');
          refresh(storageKey, deptId).then((obj) => {
            observer.next(obj);
          });
        }
      });

    });
  }

  /* 获取某人的工时资讯
    Data format of time sheet:
      {
        time: '2018-06-03 01:00:21',  // when the data obtained from server
        data: {
          "user_name":"Pony Lin",
          "user_id":"864",
          "work_hour":"8",
          "task_data": {
            "5": {
              "description":null,
              "category":"1454409586641912",
              "project_name":"RFQ_MR0_MRS000 SM Common Project \/ EP201706.062 \/ Pony Lin",
              "mon":null,"tue":"8","wed":null,"thu":null,"fri":null,"sat":null,"sun":null,
              "tag":"1458186709348034",
              "date":"2018-05-28",
              "dept_id":"317",
              "update_date":"2018-06-01",
              "profit_center":null,
              "category_name":"Control the project shcedule",
              "category_type":"Project",
              ...
            },
            "4": {
              ...
            },
            ...
          },
          "tast_status":"Reject", // "Review", "Draft", null
          "week_data":{"start":"2018-05-28","end":"2018-06-03"},
          "first_date":"2018-05-28",
          "prev_date":"2018-05-21",
          "next_date":"2018-06-04",
          "reject_reason":"Just for test",
          "show_approve":false,
          "show_reject":false,
          "show_return":false,
        }
      }
   */
  getTimeSheet(uid, startMonday) {

    let refresh = (storageKey, uid, startMonday) => {
      return new Promise((resolve, reject) => {
        this.api.get('/~pts/subsystem/tss/web_pages/application/subordinate_review.php', {
          'webmode': 'j',
          'user_id': uid,       // e.g. 864
          'date': startMonday   // e.g. 2018-05-21
        }).subscribe(resp=>{
          let info = {time: new Date(), data: resp};
          this.storage.set(storageKey, info).then(() => {
            resolve(info);
          });
          console.log(`Got timesheet of ${uid} @ ${startMonday} from server`, info);
        });
      });
    };

    return Observable.create(observer => {

      this.events.subscribe('refresh-timesheet', (uid, start_date) => {
        console.log(`Refresh timesheet of ${uid} at ${start_date}`);
        refresh(storageKey, uid, start_date).then((obj) => {
          observer.next(obj);
        });
      });

      //
      // Return the data already in storage.
      // If not yet stored then get it from server.
      //
      let storageKey = `TS-${uid}@${startMonday}`;  // e.g. TS-864@2018-05-28
      this.storage.get(storageKey).then((obj) => {
        if (obj && obj.time && obj.data) {
          console.log(`get ${storageKey} HIT`);
          observer.next(obj); // return data to consumer
        } else {
          console.log(`get ${storageKey} MISS`);
          refresh(storageKey, uid, startMonday).then((obj) => {
            observer.next(obj);  // return data to consumer
          });
        }
      });
    });

  }

}

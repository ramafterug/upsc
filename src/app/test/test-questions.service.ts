/// <reference path = "../models.ts" />
import * as afterUGExtended from "../models";
import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { QuestionRawExtended } from '../questionraw';

@Injectable()
export class TestQuestionService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  //private testQuestionUrl = '/api/Question/Test/';

  private testQuestionUrl = 'http://localhost:54347/api/Question/Test/';
  constructor(private http: Http) { }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }


  getQuestions(testNo: Number, userID: Number): Observable<QuestionRawExtended[]> {

    return this.http.get(this.testQuestionUrl + testNo + '/User/' + userID)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server Error'));

  }

  saveAttemptsToDB(attemptsToSave: afterUGExtended.afterugExtended.Attempts[]): Observable<string> {
    var attemptsUrl = 'http://localhost:54347/api/Attempts'; 
 let bodyString = JSON.stringify(attemptsToSave); // Stringify payload
        let headers      = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
        let options       = new RequestOptions({ headers: headers }); 
    
    return this.http.post(attemptsUrl, bodyString, options) // ...using post request
                         .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

  }


}




/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
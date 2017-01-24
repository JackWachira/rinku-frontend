import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';

import { Token } from './token';

import { Observable } from 'rxjs/Observable';

// import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
@Injectable()
export class LinksService {
  constructor(
    private http: Http
  ) { }

  links = Array;

  private extractData(res: Response) {
    console.log(res);

    let body = res.json();
    return body.data || {};
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    console.log(error);

    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  getAccessToken(requestObject): Observable<Token> {
    let params = new URLSearchParams();
    params.set('client_id', requestObject['client_id']);
    params.set('client_secret', requestObject['client_secret']);
    params.set('code', requestObject['code']);
    params.set('redirect_uri', 'http://localhost:4200/links');

    const url = 'https://slack.com/api/oauth.access';
    return this.http
      .get(url, { search: params })
      .map(this.extractData)
      .catch(this.handleError);
  }

}

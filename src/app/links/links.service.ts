import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';

import { Token } from './token';
import { Link } from './link';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LinksService {
  constructor(
    private http: Http
  ) { }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(error: Response | any) {
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

  getLinks(teamId): Observable<Link> {
    return this.http
      .get('https://rinku-bot.herokuapp.com/links?teamId=' + teamId)
      .map(this.extractData)
      .catch(this.handleError)
  }
}

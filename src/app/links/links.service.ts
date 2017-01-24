import { Injectable }    from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import { Token } from './token'

import { Observable } from 'rxjs/Observable'

// import 'rxjs/add/operator/toPromise';

@Injectable()
export class LinksService {
  constructor (
    private http: Http
  ) {}

  links = Array;

  private extractData(res: Response) {
    console.log(res);
    
    let body = res.json();
    return body.data || { };
  }

  private handleError (error: Response | any) {
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
  
  getAccessToken(temp_code): Observable<Token> {
    const url = `http://localhost:3000/oauth`;
    return this.http
      .get(url, temp_code)
      .map(this.extractData)
      .catch(this.handleError);
  }

}
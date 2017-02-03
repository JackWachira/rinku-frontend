import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LinksService } from './links.service';

import { Link } from './link';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css']
})
export class LinksComponent implements OnInit {
  requestObject: any;
  links: any;
  teamId: string;
  authObject: any;
  error: any;

  constructor(
    private route: ActivatedRoute,
    private linksService: LinksService
  ) { }

  ngOnInit() {
    let self = this;
    self.authObject = JSON.parse(localStorage.getItem('rinku'));
    self.route.queryParams.subscribe(
      val => {
        self.requestObject = {
          client_id: '126735187141.129500575763',
          client_secret: '4c0774074e25b401c9cfa98faa735b84',
          code: val['code'],
        };
      }, 
      error => console.log(error)
    );

     const getAccessToken = function getAccessToken() {
      self.linksService.getAccessToken(self.requestObject).subscribe(
        token => {
          localStorage.setItem('rinku', JSON.stringify(token));

          if (token.ok) {
            self.teamId = token.team.id;
            getLinks();  
          } else {
            self.error = token.error;
          }
        },
        error => console.log(error)
      );
    }

    const getLinks = function() {
      self.linksService.getLinks(self.teamId).subscribe(
        links => {
          self.links = links;
        },
        error => console.log(error)
      )
    }

    if (self.authObject) {    
      if(self.authObject.ok) {
        self.teamId = JSON.parse(localStorage.getItem('rinku')).team.id;
        getLinks();
      } else {
        if (self.requestObject.code) {
          getAccessToken();
        } else {
          self.error = self.authObject.error;
        }
      }
    } else {
       if (self.requestObject.code) {
        getAccessToken();
      } else {
        self.error = 'You need to sign in to see anything on this page';
      }
    }
  }
}

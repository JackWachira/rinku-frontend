import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalStorageService } from 'ng2-webstorage';
import { LinksService } from './links.service';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})

export class LinksComponent implements OnInit {
  requestObject: any;
  links: any;
  teamId: string;
  authObject: any;
  error: any;

  constructor(
    private route: ActivatedRoute,
    private linksService: LinksService,
    private storage: LocalStorageService
  ) {}

  ngOnInit() {
    let self = this;

    self.authObject = self.storage.retrieve('rinku');
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
          self.storage.store('rinku', token);

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
        self.teamId = self.storage.retrieve('rinku').team.id;
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

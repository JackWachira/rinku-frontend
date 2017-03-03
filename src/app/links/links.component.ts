import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalStorageService } from 'ng2-webstorage';
import { LinksService } from './links.service';
import { Observable } from 'rxjs/Observable';
import { Link } from './link';
import { SkeletonService } from '../shared/skeleton.service';
import { ChannelItem } from '../shared/channel-item';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
})

export class LinksComponent implements OnInit {
  @Input() articles = new Array();
  @Input() channelName = '';
  requestObject: any;
  links: any;
  teamId: string;
  teamName: string;
  authObject: any;
  error: any;
  async = require('async');
  stuff: Observable<Link[]>;

  constructor(
    private route: ActivatedRoute,
    private linksService: LinksService,
    private storage: LocalStorageService,
    private skeletonService: SkeletonService,
  ) {
    this.route
      .queryParams
      .subscribe(params => {
        this.channelName = params['channel'];
      });
  }

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
            self.teamName = token.team.name;
            getLinks();
          } else {
            self.error = token.error;
          }
        },
        error => console.log(error)
      );
    };

    const getLinks = function () {
      self.stuff = self.linksService.getLinks(self.teamId);
      self.stuff.subscribe(val => {
        val.map(link => {
          link.urls.map(url => {
            self.articles.push({
              'channel_id': link.channel_id,
              'channel_name': link.channel_name,
              'team_id': link.team,
              'text': link.text,
              'timestamp': link.timestamp,
              'url': url,
            });
          });
        });
      });
    };

    if (self.authObject) {
      if (self.authObject.ok) {
        self.teamId = self.storage.retrieve('rinku').team.id;
        self.teamName = self.storage.retrieve('rinku').team.name;
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
  onChannelChanged(item: ChannelItem) {
    this.channelName = item.name;
  }
}

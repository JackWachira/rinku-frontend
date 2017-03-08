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
  teamId: string;
  teamName: string;
  error: any;
  stuff: Observable<Link[]>;
  p: number = 1;
  total: number;

  constructor(
    private route: ActivatedRoute,
    private linksService: LinksService,
    private storage: LocalStorageService,
    private skeletonService: SkeletonService
  ) {
    this.skeletonService.getChannelEmitter().subscribe(item => this.onChannelChanged(item));		
  }

  getPage(page: number) {
    this.articles = [];
    this.stuff = this.linksService.getLinksByChannel(this.teamId, this.channelName, page, 6);
    this.stuff.subscribe(val => {
      this.p = val.page;
      this.total = val.total;

      val.docs.map(link => {
        link.urls.map(url => {
          this.articles.push({
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
  }

  onChannelChanged(item: ChannelItem) {
    this.total = item.count;
    this.channelName = item.name;
    this.getPage(1);
  }

  ngOnInit() {
    let self = this;
    let authObject = this.storage.retrieve('rinku');

    if(authObject) {
      if(authObject.ok) {
        this.teamId = authObject.team.id;
        this.teamName = authObject.team.name;
      } else {
        this.error = authObject.error;
      }
    } else {
      this.storage.observe('rinku').subscribe(
        rinku => {
          if(rinku.ok) {
            this.teamId = rinku.team.id;
            this.teamName = rinku.team.name;
          } else {
            this.error = rinku.error;
          }
        }
      );
    }
  }
}

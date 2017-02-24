import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocalStorageService } from 'ng2-webstorage';
import { LinksService } from './links.service';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})

export class LinksComponent implements OnInit {
  @Input() articles = new Array();
  requestObject: any;
  links: any;
  teamId: string;
  teamName: string;
  authObject: any;
  error: any;
  metascraper = require('metascraper');
  async = require('async');
  metaInspector = require('node-metainspector');
  cheerio = require('cheerio')

  constructor(
    private route: ActivatedRoute,
    private linksService: LinksService,
    private storage: LocalStorageService
  ) { }

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
      self.linksService.getLinks(self.teamId).subscribe(
        links => {
          self.links = links;
          self.getmetaInspectorlinks();
          // self.scrapeUrls(links);
        },
        error => console.log(error)
      )
    }

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

  sanitizeUrl(url) {
    let matcher = new RegExp('[^\|]*');
    return url.match(matcher)[0];
  }

  getmetaInspectorlinks() {
    let $ = this.cheerio.load('<h2 class="title">Hello world</h2>');

    $('h2.title').text('Hello there!');
    $('h2').addClass('welcome');

    $.html();
  }




  scrapeUrls(links) {
    let that = this;
    let tempLinks = links;
    this.async.map(tempLinks, mapScrape, function (err, results) {
      // console.log('res: ', results);
      for (let item of that.articles) {
          console.log('image: ', item.urls.image);
      }
    });

    function mapScrape(link, done) {
      link.urls.map(val => {
        that.metascraper.scrapeUrl(that.sanitizeUrl(val.value)).then((metadata) => {
          link.urls = metadata;
          that.articles.push(link);
          done(null, link);
        });
      });
    }

  }
}

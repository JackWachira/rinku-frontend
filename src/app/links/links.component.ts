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

  constructor(
    private route: ActivatedRoute,
    private linksService: LinksService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(val => {
      this.requestObject = {
        client_id: '126735187141.129500575763',
        client_secret: '4c0774074e25b401c9cfa98faa735b84',
        code: val['code'],
      };
    });

    this.linksService.getAccessToken(this.requestObject).subscribe(
      token => {
        localStorage.setItem('rinku', JSON.stringify(token))
      },
      error => console.log(error)
    );

    this.linksService.getLinks(JSON.parse(localStorage.getItem('rinku')).team_id).subscribe(
      links => {
        this.links = links;
        console.log(`LINKS: ${this.links}`);
      },
      error => console.log(error)
    )
  }

}

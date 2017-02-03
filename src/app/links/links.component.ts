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
    
    this.authObject = JSON.parse(localStorage.getItem('rinku'));
    this.route.queryParams.subscribe(
      val => {
        this.requestObject = {
          client_id: '126735187141.129500575763',
          client_secret: '4c0774074e25b401c9cfa98faa735b84',
          code: val['code'],
        };
      }, 
      error => console.log(error)
    );

    function getAccessToken(requestObject) {

    }

    if (this.authObject) {    
      if(this.authObject.ok) {
        this.teamId = JSON.parse(localStorage.getItem('rinku')).team.id;

        this.linksService.getLinks(this.teamId).subscribe(
          links => {
            this.links = links;
          },
          error => console.log(error)
        )
      } else {
        if (this.requestObject.code) {
          this.linksService.getAccessToken(this.requestObject).subscribe(
            token => {
              localStorage.setItem('rinku', JSON.stringify(token));

              if (JSON.parse(localStorage.getItem('rinku')).ok) {
                this.linksService.getLinks(token.team.id).subscribe(
                  links => {
                    this.links = links;
                  },
                  error => console.log(error)
                )  
              } else {
                this.error = JSON.parse(localStorage.getItem('rinku')).error;
              }
            },
            error => console.log(error)
          );
        } else {
          this.error = this.authObject.error;
        }
      }
    } else {
       if (this.requestObject.code) {
        this.linksService.getAccessToken(this.requestObject).subscribe(
          token => {
            localStorage.setItem('rinku', JSON.stringify(token));

            if (JSON.parse(localStorage.getItem('rinku')).ok) {
              this.linksService.getLinks(token.team.id).subscribe(
                links => {
                  this.links = links;
                },
                error => console.log(error)
              )  
            } else {
              this.error = JSON.parse(localStorage.getItem('rinku')).error;
            }
          },
          error => console.log(error)
        );
      } else {
        this.error = 'You need to sign in to see anything on this page';
      }
    }
  }
}

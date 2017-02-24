import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LinksService } from '../links/links.service';
import { LocalStorageService } from 'ng2-webstorage';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
  providers: [LinksService]
})

export class Skeleton implements OnInit {
  links: any;
  userAvatar: string;
  userName: string;
  teamId: string;
  authObject: any;
  requestObject: any;
  selectedChannel: string;
  channelNames: Array<String>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private linksService: LinksService,
    private storage: LocalStorageService
  ) { }

  public disabled: boolean = false;
  public status: { isopen: boolean } = { isopen: false };

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  logout(): void {
    this.storage.clear('rinku');
    this.router.navigateByUrl('/');
  }

  filterLinksByChannel(channelName: string): void {
    if(channelName === 'all') {
      this.linksService.setLinks(this.links);        
    } else {
      let tempLinkContainer = [];

      this.links.map((link) => {
        if(link.channel_name === channelName) {
          tempLinkContainer.push(link);
        }
      });

      this.linksService.setLinks(tempLinkContainer);        
    }
  }

  ngOnInit(): void {
    let self = this;
    let names = [];

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
            self.userAvatar = token.user.image_48;
            self.userName = token.user.name;
            self.teamId = token.team.id;
            getLinks();  
          } else {
            console.log(token.error);
          }
        },
        error => console.log(error)
      );
    }

    const getLinks = function() {
      self.linksService.getLinks(self.teamId).subscribe(
        links => {
          self.links = links;

          // This is to make sure channel names are not repeated
          self.links.map((link) => {
            if(names.indexOf(link.channel_name) === -1) {
              names.push(link.channel_name);
            }
          });
          self.channelNames = names;

          // Inform subscribed components of new links
          self.linksService.setLinks(self.links);
        },
        error => console.log(error)
      )
    }

    if (self.authObject) {    
      if(self.authObject.ok) {
        self.userAvatar = self.authObject.user.image_48;
        self.userName = self.authObject.user.name;
        self.teamId = self.authObject.team.id;
        getLinks();
      } else {
        if (self.requestObject.code) {
          getAccessToken();
        } else {
          console.log(self.authObject.error);
        }
      }
    } else {
       if (self.requestObject.code) {
        getAccessToken();
      } else {
        console.log('You need to sign in to see anything on this page.');
      }
    }
  }
}

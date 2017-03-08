import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LinksService } from '../links/links.service';
import { LocalStorageService } from 'ng2-webstorage';
import { SkeletonService } from '../shared/skeleton.service';
import { ChannelItem } from '../shared/channel-item';

@Component({
  selector: 'app-dashboard',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
  providers: [LinksService, SkeletonService]
})

export class Skeleton implements OnInit {
  userAvatar: string;
  userName: string;
  teamId: string;
  authObject: any;
  requestObject: any;
  channels: Array<String>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private linksService: LinksService,
    private storage: LocalStorageService,
    private skeletonService: SkeletonService
  ) { }

  public disabled: boolean = false;
  public status: { isopen: boolean } = { isopen: false };

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
  }

  selectChannel(channel: ChannelItem) {
    console.log('channel is: ', channel);

    this.skeletonService.changeChannel(channel);
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

  getChannels = function () {
    let self = this;
    self.linksService.getChannels(self.teamId).subscribe(
      channels => {
        self.channels = channels;

        setTimeout(function (): void {
          self.router.navigate(['/links'], { queryParams: { channel: self.channels[0].name } });
          self.selectChannel(channels[0]);
        }, 500);
      },
      error => console.log(error)
    )
  }

  ngOnInit(): void {
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
            self.userAvatar = token.user.image_48;
            self.userName = token.user.name;
            self.teamId = token.team.id;
            self.getChannels();
          } else {
            console.log(token.error);
          }
        },
        error => console.log(error)
      );
    }

    if (self.authObject) {    
      if(self.authObject.ok) {
        self.userAvatar = self.authObject.user.image_48;
        self.userName = self.authObject.user.name;
        self.teamId = self.authObject.team.id;
        self.getChannels();
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

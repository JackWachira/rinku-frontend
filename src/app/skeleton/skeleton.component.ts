import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LinksService } from '../links/links.service';
import { LocalStorageService } from 'ng2-webstorage';

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
  channelNames: Array<String>;

  constructor(
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

  ngOnInit(): void {
    let self = this;
    let names = [];

    const getLinks = function () {
      self.linksService.getLinks(self.teamId).subscribe(
        links => {
          console.log('channels 1: ', links);

          self.links = links;

          // This is to make sure channel names are not repeated
          self.links.map((link) => {
            console.log('channels: ', link);

            if (names.indexOf(link.channel_name) === -1) {
              names.push(link.channel_name);
            }
          });
          self.channelNames = names;
        },
        error => console.log(error)
      )
    }

    let auth = self.storage.retrieve('rinku');

    if (auth && auth.ok) {
      self.userAvatar = auth.user.image_48;
      self.userName = auth.user.name;
      self.teamId = auth.team.id;
      getLinks();
    } else {
      self.storage.observe('rinku').subscribe(
        authObject => {
          if (authObject.ok) {
            self.userAvatar = authObject.user.image_48;
            self.userName = authObject.user.name;
            self.teamId = authObject.team.id;
            getLinks();
          }
        },
        error => console.log(error)
      )
    }
  }
}

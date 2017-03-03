import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LinksService } from '../links/links.service';
import { LocalStorageService } from 'ng2-webstorage';
import { SkeletonService } from '../shared/skeleton.service';
import { ChannelItem } from '../shared/channel-item';

declare let alasql;
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
  channels: Array<String>;

  constructor(
    private router: Router,
    private linksService: LinksService,
    private storage: LocalStorageService,
    private skeletonService: SkeletonService
  ) { }

  public disabled: boolean = false;
  public status: { isopen: boolean } = { isopen: false };

  public toggled(open: boolean): void {
  }

  selectChannel(channel: ChannelItem) {
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
    this.linksService.getLinks(this.teamId).subscribe(
      links => {
        self.channels = alasql('SELECT DISTINCT channel_name AS [name], channel_id AS [id] \
                              , COUNT(*) AS [count] FROM ? GROUP BY channel_name', [links]);
        self.selectChannel(self.channels[0]);
      },
      error => console.log(error)
    )
  }

  ngOnInit(): void {
    let auth = this.storage.retrieve('rinku');
    if (auth && auth.ok) {
      this.userAvatar = auth.user.image_48;
      this.userName = auth.user.name;
      this.teamId = auth.team.id;
      this.getChannels();

    } else {
      this.storage.observe('rinku').subscribe(
        authObject => {
          if (authObject.ok) {
            this.userAvatar = authObject.user.image_48;
            this.userName = authObject.user.name;
            this.teamId = authObject.team.id;
            this.getChannels();
          }
        },
        error => console.log(error)
      )
    }
  }
}

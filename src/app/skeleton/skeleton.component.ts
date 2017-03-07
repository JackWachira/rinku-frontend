import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
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
        }, 500);
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

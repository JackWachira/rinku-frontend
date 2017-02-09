import { Component, OnInit } from '@angular/core';
import { LinksService } from '../links/links.service';

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
  channelNames: Array<String>;

  constructor(private linksService: LinksService
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

  ngOnInit(): void {
    let self = this;
    let names = [];
    
    let token = JSON.parse(localStorage.getItem('rinku'));

    const getLinks = function() {
      self.linksService.getLinks(token.team.id).subscribe(
        links => {
          self.links = links;

          // This is to make sure channel names are not repeated
          self.links.map((link) => {
            if(names.indexOf(link.channel_name) === -1) {
              names.push(link.channel_name);
            }
          });
          self.channelNames = names;
        },
        error => console.log(error)
      )
    }

    if (token) {    
      if(token.ok) {
        self.userAvatar = token.user.image_32;
        self.userName = token.user.name;
        getLinks();
      }
    }
  }
}

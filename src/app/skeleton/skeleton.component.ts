import { Component, OnInit } from '@angular/core';
import { LinksService } from '../links/links.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './skeleton.component.html'
})
export class Skeleton implements OnInit {
  links: any;
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
    let token = localStorage.getItem('rinku');
    this.linksService.getLinks(token['team_id']).subscribe(
      links => {
        this.links = links;
      },
      error => console.log(error)
    )
  }
}

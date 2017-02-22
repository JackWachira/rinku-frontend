import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LinksService } from './links.service';
import { LocalStorageService } from 'ng2-webstorage';

import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})

export class LinksComponent implements OnInit, OnDestroy {
  @Input() links: any;
  subscription: Subscription;
  teamName: string;

  constructor(
    private linksService: LinksService,
    private storage: LocalStorageService
  ) {
    this.subscription = linksService.linkObject$.subscribe(
      links => {
        this.links = links;
      },
      error => console.log(error)
    );
  }

  ngOnInit() {
    let authObject = this.storage.retrieve('rinku');
    if(authObject) {
      if(authObject.ok) {
        this.teamName = this.storage.retrieve('rinku').team.name
      }
    } else {
      this.storage.observe('rinku').subscribe(
        rinku => {
          if(rinku.ok) {
            this.teamName = rinku.team.name;
          }
        }
      );
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

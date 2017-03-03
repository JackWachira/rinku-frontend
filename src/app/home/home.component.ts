import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private storage: LocalStorageService
  ) { 
    const authDetails = this.storage.retrieve('rinku');

    if(authDetails) {
      if(authDetails.ok) {
        this.router.navigateByUrl('/links');
      }
    }
  }

  ngOnInit() {}
}

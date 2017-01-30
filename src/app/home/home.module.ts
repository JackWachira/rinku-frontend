import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import {HomeRoutingModule} from './home-routing.module';

import { MaterialModule } from '@angular/material';


@NgModule({
  imports: [
    HomeRoutingModule,
    CommonModule,
    MaterialModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }

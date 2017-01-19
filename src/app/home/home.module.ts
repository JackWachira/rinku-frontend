import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import {HomeRoutingModule} from './home-routing.module';

@NgModule({
  imports: [
    HomeRoutingModule,
    CommonModule,
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }

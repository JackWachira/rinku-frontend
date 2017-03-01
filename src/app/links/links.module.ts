import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinksComponent } from './links.component';
import { LinksRoutingModule } from './links-routing.module';
import { LinksService } from './links.service';
import { ExtractLink } from './link-extract.pipe';
import { FilterChannels } from './filterchannel.pipe';
import {NgPipesModule} from 'ngx-pipes';

import { MaterialModule } from '@angular/material';


@NgModule({
  imports: [
    LinksRoutingModule,
    CommonModule,
    MaterialModule,
    NgPipesModule
  ],
  providers: [
    LinksService
  ],
  declarations: [ExtractLink, FilterChannels, LinksComponent, ]
})
export class LinksModule { }

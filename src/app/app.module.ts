import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BreadcrumbsComponent } from './shared/breadcrumb.component';
import { NAV_DROPDOWN_DIRECTIVES } from './shared/nav-dropdown.directive';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './shared/sidebar.directive';
import { AsideToggleDirective } from './shared/aside.directive';
import { DropdownModule } from 'ng2-bootstrap/dropdown';
import { Ng2Webstorage } from 'ng2-webstorage';

import { Skeleton } from './skeleton/skeleton.component';


// Routing Module
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    BreadcrumbsComponent,
    NAV_DROPDOWN_DIRECTIVES,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    Skeleton
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DropdownModule.forRoot(),
    FormsModule,
    HttpModule,
    Ng2Webstorage,
    MaterialModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

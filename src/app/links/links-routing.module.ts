import { NgModule } from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';

import { LinksComponent } from './links.component';

const routes: Routes = [
    {
        path: '',
        component: LinksComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LinksRoutingModule { }

import { NgModule } from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';

import { LinksComponent } from './links.component';

const routes: Routes = [
    {
        path: '',
        component: LinksComponent,
        data: {
            title: 'Links'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LinksRoutingModule { }

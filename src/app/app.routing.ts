import { NgModule } from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';


export const routes: Routes = [
    {
        path: '',
        loadChildren: 'app/home/home.module#HomeModule',
    },
    {
        path: 'links',
        loadChildren: 'app/links/links.module#LinksModule',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

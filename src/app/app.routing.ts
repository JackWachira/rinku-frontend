import { NgModule } from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import { Skeleton } from './skeleton/skeleton.component';


export const routes: Routes = [
    {
        path: '',
        loadChildren: 'app/home/home.module#HomeModule',
    },
    {
        path: '',
        component: Skeleton,
        data: {
            title: 'Dashboard'
        },
        children: [
            {
                path: 'links',
                loadChildren: 'app/links/links.module#LinksModule'
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

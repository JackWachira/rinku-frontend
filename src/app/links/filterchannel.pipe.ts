import { Pipe, PipeTransform } from '@angular/core';
import { Link } from './link';

declare let alasql;

@Pipe({ name: 'filterChannels', pure: false })
export class FilterChannels implements PipeTransform {
    transform(articles: Link[], channel_name: String) {
        return articles.filter(article => article.channel_name === channel_name);
    }
}

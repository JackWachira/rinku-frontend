import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'extractlink'})
export class ExtractLink implements PipeTransform {
  transform(link: string): string {
    let matcher = new RegExp('[^\|]*');

    return link.match(matcher)[0];
  }
}

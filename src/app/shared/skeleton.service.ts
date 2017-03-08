import { EventEmitter, Injectable } from '@angular/core';
import { ChannelItem } from './channel-item';

@Injectable()
export class SkeletonService {
    public channelChanged$: EventEmitter<ChannelItem>;
    public queryLinks$: EventEmitter<string>;

    constructor() {
        this.channelChanged$ = new EventEmitter<ChannelItem>();
        this.queryLinks$ = new EventEmitter<string>();
    }
    getChannelEmitter() {
        return this.channelChanged$;
    }
    public changeChannel(item: ChannelItem): void {
        this.channelChanged$.emit(item);
    }
    getSearchEmitter() {
        return this.queryLinks$;
    }
    public searchLinks(query: string): void {
        this.queryLinks$.emit(query);
    }
}
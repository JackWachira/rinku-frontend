import { EventEmitter, Injectable } from '@angular/core';
import { ChannelItem } from './channel-item';

@Injectable()
export class SkeletonService {
    public channelChanged$: EventEmitter<ChannelItem>;

    constructor() {
        this.channelChanged$ = new EventEmitter<ChannelItem>();
    }
    getChannelEmitter() {
        return this.channelChanged$;
    }
    public changeChannel(item: ChannelItem): void {
        this.channelChanged$.emit(item);
    }
}
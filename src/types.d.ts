declare module 'node:events' {
    class EventEmitter {
      public static once<E extends EventEmitter, K extends keyof ClientEvents>(
        eventEmitter: E,
        eventName: E extends Client ? K : string,
      ): Promise<E extends Client ? ClientEvents[K] : any[]>;
      public static on<E extends EventEmitter, K extends keyof ClientEvents>(
        eventEmitter: E,
        eventName: E extends Client ? K : string,
      ): AsyncIterableIterator<E extends Client ? ClientEvents[K] : any>;
    }
}
export interface Message {
    conent?: string,
    embeds?: Array<Object<title<string>, description<string>, color<number> >>,
}
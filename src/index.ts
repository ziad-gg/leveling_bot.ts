import axios, { AxiosHeaders, formToJSON } from "axios"
import { Message } from "./types";
import { EventEmitter } from "events"

class Client {
  
   private auth = "" as string
   private events = new EventEmitter() as (any | VoidFunction)
   private fetchApi: (string | any) = "notlogin"
   private stats = false as (null | boolean | undefined | never)

   constructor() {
      this.stats
   }
    
   async login(token: string | any) {
    this.auth = token
    this.fetchApi = axios.create({headers: {'Authorization': `${this.auth}`, "Content-Type": "application/json", "Accept": "application/json" }});
    this.stats = true // open
    await this.fetchApi({url: DiscordAPI("/users/@me"), method: "GET"}).then((data: any) => {
      this.events.emit("ready", formToJSON(data.data))
    }).catch((e: JSON) => {
      this.stats = null
     throw new Error(e.toString());
    })
   }

   async send(channelId: (string | number), _data: Message) {
    if (!this.stats) throw new Error("Invalid Token");
    this.fetchApi({url: DiscordAPI(`/channels/${channelId}`), method: "GET"}).then(async (data: JSON) => {
      this.fetchApi({url: DiscordAPI(`/channels/${channelId}/messages`), method: "POST", data: {content: _data.conent}}).catch((e: JSON) => { // users accounts cant send embeds :)
         throw new Error(`error ${e.toString()}`);
      })
    }).catch((e: JSON) => {
      throw new Error("Invalid channel")
    });
   }

   public on(name: string, callback: any ) {
     this.events.on(name, callback)
   }
  
   public once(name: string, callback: any ) {
      this.events.once(name, callback)
   }
}

function DiscordAPI(url: string) { return 'https://discord.com/api/v9/' + url };

async function deloy(token: string, channelId: string) {

   const content = async () => {
      const { data } = await axios.get('https://random-word-api.herokuapp.com/all').then(e => e)
      let index: number = Math.floor(Math.random() * data.length)
      let _content: string = data[index]+data[index+1]+data[index+2]
      if (typeof _content === "string") return _content
      else throw Error("invalid type")
   }
  
   const bot = new Client();

   bot.on("ready", (data: (any)) => {
      setInterval(async() => {
         const _content = await content();
         bot.send(channelId, {conent: _content});
      }, 5500)
   });

   bot.login(token);
}
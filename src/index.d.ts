declare module "djs-minigames"{
import { CommandInteraction, User, ColorResolvable } from "discord.js"
import {EventEmitter} from "node:events"
export class Client extends EventEmitter implements ClientOptions{
    public playMoreThanOne?: boolean;
    public defaultTimeout?: number;
    public language?: "EN" | "ES"
    constructor(options?:ClientOptions)
}
export class TicTacToe implements TicTacToeOptions{
    public embedColor?: ColorResolvable 
    public timeout?: number 
    public xEmoji?: string
    public oEmoji?: string 
    public embedFooter?: string 
    public timeoutEmbedColor?: ColorResolvable 
    public gameClient: Client
    public interaction: CommandInteraction
    public user: User
    constructor(client: Client, interaction: CommandInteraction, user: User, options?: TicTacToeOptions)
    public play():any
}

export interface TicTacToeOptions{
    embedColor?: ColorResolvable
    timeout?: number 
    xEmoji?: string 
    oEmoji?: string 
    embedFooter?: string 
    timeoutEmbedColor?: ColorResolvable 
    }

export interface ClientOptions{
    playMoreThanOne?: boolean | null
    defaultTimeout?: number | null
    language?: "ES" | "EN"
}
}
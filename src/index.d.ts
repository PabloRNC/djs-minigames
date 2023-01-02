import type{ CommandInteraction, User, ColorResolvable, InteractionResponse, TextBasedChannel } from 'discord.js'
import { EventEmitter } from 'node:events'
import TypedEventEmitter from 'typed-emitter'
import type{ Events } from './util/Events'
declare module 'djs-minigames'{
export class Client extends (EventEmitter as new () => TypedEventEmitter<Events>) implements ClientOptions{
	public playMoreThanOne?: boolean
	public defaultTimeout?: number
	public emitEvents?: boolean
	public language?: 'EN' | 'ES'
	constructor(options?:ClientOptions)
}
export class TicTacToe implements TicTacToeOptions{
	public textChannel?: TextBasedChannel | null
	public embedColor?: ColorResolvable | null
	public winner? : User | null
	public timeout?: number
	public xEmoji?: string
	public oEmoji?: string
	public _emoji?: string
	public embedFooter?: string | null
	public timeoutEmbedColor?: ColorResolvable | null
	public gameClient: Client
	public interaction: CommandInteraction
	public target: User
	public user: User
	public positions: object
	public status: string | null
	constructor(client: Client, interaction: CommandInteraction, user: User, options?: TicTacToeOptions)
	public play(): Promise<void | InteractionResponse<boolean>>
}

export interface TicTacToeOptions{
    embedColor?: ColorResolvable |null
    timeout?: number 
    xEmoji?: string 
    oEmoji?: string 
    embedFooter?: string | null
    timeoutEmbedColor?: ColorResolvable | null
}

export interface ClientOptions{
    playMoreThanOne?: boolean
    defaultTimeout?: number
    emitEvents?: boolean
    language?: 'ES' | 'EN'
}
}
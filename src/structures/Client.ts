import { EventEmitter } from 'node:events'
import { validateClient } from '../util/Preconditions'
import TypedEmitter from 'typed-emitter'
import { Events } from '../util/Events'


export class Client extends (EventEmitter as new () => TypedEmitter<Events>) implements ClientOptions{
	public playMoreThanOne?: boolean
	public defaultTimeout?: number
	public emitEvents? :boolean
	public language?: 'EN' | 'ES'
	constructor(options?:ClientOptions){
		super()
		this.playMoreThanOne = options?.playMoreThanOne ?? false
		this.defaultTimeout = options?.defaultTimeout  ?? 60000
		this.emitEvents = options?.emitEvents ?? false
		this.language = options?.language ?? 'EN'
		validateClient(this)
	}
}

export interface ClientOptions{
playMoreThanOne?: boolean
defaultTimeout?: number
emitEvents?: boolean
language?: 'EN' | 'ES'
}


import { Client } from '../structures/Client'
import { User, CommandInteraction } from 'discord.js'

export function isClient(client: Client){
    if (!(client instanceof Client)){
        throw new TypeError('An invalid djs-minigames was provided.')
    }
}


export function isInteraction(interaction: CommandInteraction){
    if (!(interaction instanceof CommandInteraction)) {
        throw new TypeError('An invalid Discord.js CommandInteraction was provided.')
    }
}


export function isUser(user: User){
    if (!(user instanceof User)){
        throw new TypeError('An invalid Discord.js User was provided.')
    }
}

export function validateClient(client: Client){
    if (typeof client.emitEvents !== 'boolean'){
        throw new TypeError(`The emitsEvents option of Discord.js Client must to be a boolean, recived(${typeof client.emitEvents})`)
    }
    if (typeof client.defaultTimeout !== 'number'){
        throw new TypeError(`The defaultTimeout option of Discord.js Client muest to be a number, recived(${typeof client.defaultTimeout})`)
    }
    if (typeof client.playMoreThanOne !== 'boolean'){
        throw new TypeError(`The playMoreThanOne option of Discord.js Client must to be a boolean, recived(${typeof client.playMoreThanOne}`)
    }
}

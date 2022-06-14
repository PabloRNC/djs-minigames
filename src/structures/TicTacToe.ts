import { CommandInteraction, User, ColorResolvable, Message, InteractionCollector, TextBasedChannel } from 'discord.js'
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js'
import { Client } from './Client'
import { isUser, isInteraction, isClient } from '../util/Preconditions'
import Languages from "../util/Languages.json"
const playing = new Set()


export class TicTacToe implements TicTacToeOptions{
    public textChannel?: TextBasedChannel
    public embedColor?: ColorResolvable
    public winner? : any
    public timeout?: number
    public xEmoji?: string
    public oEmoji?: string
    public _emoji?: string
    public embedFooter?: string
    public timeoutEmbedColor?: ColorResolvable
    public gameClient: Client
    public interaction: CommandInteraction
    public target: User
    public user: User
    public positions: object
    public status: string
    constructor(gameClient: Client, interaction: CommandInteraction, user: User, options?: TicTacToeOptions){
      this.gameClient = gameClient
      this.interaction = interaction
      this.target = user
      this.timeout = options?.timeout ?? this.gameClient.defaultTimeout
      this.user = this.interaction.user
      this.embedColor = options?.embedColor ?? 'BLUE'
      this.xEmoji = options?.xEmoji ?? '❌​'
      this.oEmoji = options?.oEmoji ?? '⭕​'
      this._emoji = options?._emoji ?? '➖'
      this.embedFooter = options?.embedFooter ?? Languages.TicTacToe[this.gameClient.language].embedFooter
      this.timeoutEmbedColor = options?.timeoutEmbedColor ?? 'RED'
      this.positions = {}
      this.status = null
      this.textChannel = this.interaction.channel


    }

    public async play(){
    const Dictionary = Languages.TicTacToe[this.gameClient.language]
     if(this.target.bot) return this.interaction.reply({content: Dictionary.playerBOT, ephemeral: true})
     if (this.target === this.interaction.user) return this.interaction.reply({ content: Dictionary.samePlayer, ephemeral: true })
     if (!this.gameClient.playMoreThanOne){
     if (playing.has(this.user.id && 'playing')) return this.interaction.reply({ content: Dictionary.alreadyPlaying, ephemeral: true })
     if (playing.has(this.target.id && 'playing')) return this.interaction.reply({ content: Dictionary.targetPlaying, ephemeral: true })
     if (playing.has(this.user.id && 'requesting')) return this.interaction.reply({ content: Dictionary.alreadyChallenged, ephemeral: true })
     if (playing.has(this.target.id && 'requesting')) return this.interaction.reply({ content: Dictionary.targetChallenged, ephemeral: true})
    }
     isClient(this.gameClient)
     isInteraction(this.interaction)
     isUser(this.target)
     const btns: MessageButton[] = [

        new MessageButton()
        .setCustomId('u1')
        .setStyle('SECONDARY')
        .setLabel(`${this._emoji}`),
        new MessageButton()
        .setCustomId('u2')
        .setStyle('SECONDARY')
        .setLabel(`${this._emoji}`),
        new MessageButton()
        .setCustomId('u3')
        .setStyle('SECONDARY')
        .setLabel(`${this._emoji}`),
        new MessageButton()
        .setCustomId('m1')
        .setStyle('SECONDARY')
        .setLabel(`${this._emoji}`),
        new MessageButton()
        .setCustomId('m2')
        .setStyle('SECONDARY')
        .setLabel(`${this._emoji}`),
        new MessageButton()
        .setCustomId('m3')
        .setStyle('SECONDARY')
        .setLabel(`${this._emoji}`),
        new MessageButton()
        .setCustomId('d1')
        .setStyle('SECONDARY')
        .setLabel(`${this._emoji}`),
        new MessageButton()
        .setCustomId('d2')
        .setStyle('SECONDARY')
        .setLabel(`${this._emoji}`),
        new MessageButton()
        .setCustomId('d3')
        .setStyle('SECONDARY')
        .setLabel(`${this._emoji}`)
    ]

    const embed = new MessageEmbed()
        .setTitle('TicTacToe')
        .setDescription(`${this.target.toString()}, ${Dictionary.requestEmbedDescription}`)
        .setColor(this.embedColor)
        .setFooter({ text: this.embedFooter })


        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('accept')
            .setLabel(Dictionary.Accept)
            .setStyle('SUCCESS'),
            new MessageButton()
            .setCustomId('decline')
            .setLabel(Dictionary.Decline)
            .setStyle('DANGER')
        )

      const msg = await this.interaction.reply({ embeds: [embed], components: [row], fetchReply: true }) as Message
      const collector = await msg.createMessageComponentCollector({ time: this.timeout, max: 1 })
      if (!this.gameClient.playMoreThanOne){
        playing.add(this.user.id && 'requesting')
        playing.add(this.target.id && 'requesting')
        }
      collector.on('collect', async(i) => {
        if (i.customId === 'accept'){
         if (!this.gameClient.playMoreThanOne){
         playing.delete(this.user.id && 'requesting')
         playing.delete(this.target.id && 'requesting')
         }
         if (i.user !== this.target) return i.reply({ content: Dictionary.noChallenged, ephemeral: true })
         i.reply({ content: Dictionary.Accepted, ephemeral: true })
         collector.stop()
         if (!this.gameClient.playMoreThanOne){
         playing.add(this.user.id && 'playing')
         playing.add(this.target.id && 'playing')
         }
         const embed = new MessageEmbed()
         .setTitle('TicTacToe')
         .setDescription(`${this.target.toString()}, ${Dictionary.haveToPlay} ${this.oEmoji}`)
         .setFooter({ text: this.embedFooter })
         .setColor(this.embedColor)

                   const row1 = new MessageActionRow()
                    .addComponents(
                     new MessageButton()
                     .setCustomId(btns[0].customId)
                     .setLabel(btns[0].label)
                     .setStyle('SECONDARY'),
                     new MessageButton()
                     .setCustomId(btns[1].customId)
                     .setLabel(btns[1].label)
                     .setStyle('SECONDARY'),
                     new MessageButton()
                     .setCustomId(btns[2].customId)
                     .setLabel(btns[2].label)
                     .setStyle('SECONDARY')
                    )
                    const row2 = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                        .setCustomId(btns[3].customId)
                        .setLabel(btns[3].label)
                        .setStyle('SECONDARY'),
                        new MessageButton()
                        .setCustomId(btns[4].customId)
                        .setLabel(btns[4].label)
                        .setStyle('SECONDARY'),
                        new MessageButton()
                        .setCustomId(btns[5].customId)
                        .setLabel(btns[5].label)
                        .setStyle('SECONDARY')


                    )
                    const row3 = new MessageActionRow()
                    .addComponents(
                     new MessageButton()
                     .setCustomId(btns[6].customId)
                     .setLabel(btns[6].label)
                     .setStyle('SECONDARY'),
                     new MessageButton()
                     .setCustomId(btns[7].customId)
                     .setLabel(btns[7].label)
                     .setStyle('SECONDARY'),
                     new MessageButton()
                     .setCustomId(btns[8].customId)
                     .setLabel(btns[8].label)
                     .setStyle('SECONDARY')
                    )

         msg.edit({ embeds: [embed], components: [row1, row2, row3] })
         const collector1 = await msg.createMessageComponentCollector() as InteractionCollector<any>
         let turnEmoji = this.oEmoji
         collector1.on('collect', async(i) => {

             if (this.oEmoji === turnEmoji && i.user !== this.target) return i.reply({ content: i.user === this.interaction.user? Dictionary.isNotYourTurn: Dictionary.isNotPlaying, ephemeral: true })
             if (this.xEmoji === turnEmoji && i.user !== this.interaction.user) return i.reply({ content: i.user === this.target? Dictionary.isNotYourTurn: Dictionary.isNotPlaying, ephemeral: true })
             if (turnEmoji === this.oEmoji && i.user === this.target){
                 await i.deferUpdate()
                    const btn = btns.filter(b => b.customId === i.customId)
                    btn[0].label = this.oEmoji
                    btn[0].setDisabled()
                    btn[0].style = 'DANGER'


                    const row1 = new MessageActionRow()
                    .addComponents(
                     new MessageButton()
                     .setCustomId(btns[0].customId)
                     .setLabel(btns[0].label)
                     .setStyle(btns[0].style)
                     .setDisabled(btns[0].disabled),
                     new MessageButton()
                     .setCustomId(btns[1].customId)
                     .setLabel(btns[1].label)
                     .setStyle(btns[1].style)
                     .setDisabled(btns[1].disabled),
                     new MessageButton()
                     .setCustomId(btns[2].customId)
                     .setLabel(btns[2].label)
                     .setStyle(btns[2].style)
                     .setDisabled(btns[2].disabled)
                    )
                    const row2 = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                        .setCustomId(btns[3].customId)
                        .setLabel(btns[3].label)
                        .setStyle(btns[3].style)
                        .setDisabled(btns[3].disabled),
                        new MessageButton()
                        .setCustomId(btns[4].customId)
                        .setLabel(btns[4].label)
                        .setStyle(btns[4].style)
                        .setDisabled(btns[4].disabled),
                        new MessageButton()
                        .setCustomId(btns[5].customId)
                        .setLabel(btns[5].label)
                        .setStyle(btns[5].style)
                        .setDisabled(btns[5].disabled)


                    )
                    const row3 = new MessageActionRow()
                    .addComponents(
                     new MessageButton()
                     .setCustomId(btns[6].customId)
                     .setLabel(btns[6].label)
                     .setStyle(btns[6].style)
                     .setDisabled(btns[6].disabled),
                     new MessageButton()
                     .setCustomId(btns[7].customId)
                     .setLabel(btns[7].label)
                     .setStyle(btns[7].style)
                     .setDisabled(btns[7].disabled),
                     new MessageButton()
                     .setCustomId(btns[8].customId)
                     .setLabel(btns[8].label)
                     .setStyle(btns[8].style)
                     .setDisabled(btns[8].disabled)
                    )


                    turnEmoji = this.xEmoji
                    if (btns[0].label === btns[3].label && btns[0].label === btns[6].label && btns[0].label !== `${this._emoji}`|| btns[1].label === btns[4].label && btns[1].label === btns[7].label && btns[1].label !== `${this._emoji}` || btns[2].label
                     === btns[5].label && btns[2].label === btns[8].label && btns[2].label !== `${this._emoji}`|| btns[0].label === btns[1].label && btns[0].label === btns[2].label && btns[0].label !== `${this._emoji}`|| btns[3].label === btns[4].label && btns[3].label === btns[5].label && btns[3].label !== `${this._emoji}`||
                     btns[6].label === btns[7].label && btns[6].label === btns[8].label && btns[6].label !== `${this._emoji}`|| btns[0].label === btns[4].label && btns[0].label === btns[8].label && btns[0].label !== `${this._emoji}`|| btns[2].label === btns[4].label && btns[2].label === btns[6].label && btns[2].label !== `${this._emoji}`){
                         const embed = new MessageEmbed()
                         .setTitle(Dictionary.Ended)
                         .setDescription(`${btns[0].label} | ${btns[1].label} | ${btns[2].label}\n${btns[3].label} | ${btns[4].label} | ${btns[5].label}\n${btns[6].label} | ${btns[7].label} | ${btns[8].label}`)
                         .setColor(this.embedColor)
                         .setTimestamp()

                        collector1.stop()
                        if (!this.gameClient.playMoreThanOne){
                        playing.delete(this.target.id && 'playing')
                        playing.delete(this.user.id && 'playing')
                        }
                         this.status = 'won'
                         this.winner = this.target
                         this.positions = { u1: btns[0].label, u2: btns[1].label, u3: btns[2].label, m1: btns[3].label, m2: btns[4].label, m3: btns[5].label, d1: btns[6].label, d2: btns[7].label, d3: btns[8].label }
                        if (this.gameClient.emitEvents) this.gameClient.emit('tictactoeEnd', this)
                         return i.editReply({ embeds: [embed], components: [] })
                     }
                     if (btns.filter(b => b.label !== `${this._emoji}`).length === 9){
                         const embed = new MessageEmbed()
                         .setTitle(Dictionary.Tied)
                         .setDescription(`${btns[0].label} | ${btns[1].label} | ${btns[2].label}\n${btns[3].label} | ${btns[4].label} | ${btns[5].label}\n${btns[6].label} | ${btns[7].label} | ${btns[8].label}`)
                         .setColor(this.embedColor)
                         .setTimestamp()

                         if (!this.gameClient.playMoreThanOne){
                         playing.delete(this.target.id && 'playing')
                         playing.delete(this.user.id && 'playing')
                         }

                         this.status = 'tied'
                         this.positions = { u1: btns[0].label, u2: btns[1].label, u3: btns[2].label, m1: btns[3].label, m2: btns[4].label, m3: btns[5].label, d1: btns[6].label, d2: btns[7].label, d3: btns[8].label }
                         if (this.gameClient.emitEvents) this.gameClient.emit('tictactoeEnd', this)
                         return i.editReply({ embeds: [embed], components: [] })
                     }

                    i.editReply({ embeds: [embed.setDescription(`${this.interaction.user.toString()}, ${Dictionary.haveToPlay} ${this.xEmoji}`)], components: [row1, row2, row3] })
                 }
                 if (turnEmoji === this.xEmoji && i.user === this.interaction.user){
                     await i.deferUpdate()
                     const btn = btns.filter(b => b.customId === i.customId)
                     btn[0].label = this.xEmoji
                     btn[0].setDisabled()
                     btn[0].style = 'PRIMARY'

                     if (btns[0].label === btns[3].label && btns[0].label === btns[6].label && btns[0].label !== `${this._emoji}`|| btns[1].label === btns[4].label && btns[1].label === btns[7].label && btns[1].label !== `${this._emoji}` || btns[2].label
                     === btns[5].label && btns[2].label === btns[8].label && btns[2].label !== `${this._emoji}`|| btns[0].label === btns[1].label && btns[0].label === btns[2].label && btns[0].label !== `${this._emoji}`|| btns[3].label === btns[4].label && btns[3].label === btns[5].label && btns[3].label !== `${this._emoji}`||
                     btns[6].label === btns[7].label && btns[6].label === btns[8].label && btns[6].label !== `${this._emoji}`|| btns[0].label === btns[4].label && btns[0].label === btns[8].label && btns[0].label !== `${this._emoji}`|| btns[2].label === btns[4].label && btns[2].label === btns[6].label && btns[2].label !== `${this._emoji}`){
                          const embed = new MessageEmbed()
                          .setTitle(Dictionary.Ended)
                          .setDescription(`${btns[0].label} | ${btns[1].label} | ${btns[2].label}\n${btns[3].label} | ${btns[4].label} | ${btns[5].label}\n${btns[6].label} | ${btns[7].label} | ${btns[8].label}`)
                          .setColor(this.embedColor)
                          .setTimestamp()

                          if (!this.gameClient.playMoreThanOne){
                          playing.delete(this.target.id && 'playing')
                          playing.delete(this.user.id && 'playing')
                          }

                          collector1.stop()
                          this.status = 'won'
                          this.winner = this.user
                          this.positions = { u1: btns[0].label, u2: btns[1].label, u3: btns[2].label, m1: btns[3].label, m2: btns[4].label, m3: btns[5].label, d1: btns[6].label, d2: btns[7].label, d3: btns[8].label }
                          if (this.gameClient.emitEvents) this.gameClient.emit('tictactoeEnd', this)
                           return i.editReply({ embeds: [embed], components: [] })
                      }
                      if (btns.filter(b => b.label !== `${this._emoji}`).length === 9){
                          const embed = new MessageEmbed()
                          .setTitle(Dictionary.Tied)
                          .setDescription(`${btns[0].label} | ${btns[1].label} | ${btns[2].label}\n${btns[3].label} | ${btns[4].label} | ${btns[5].label}\n${btns[6].label} | ${btns[7].label} | ${btns[8].label}`)
                          .setColor(this.embedColor)
                          .setTimestamp()
                          if (!this.gameClient.playMoreThanOne){
                          playing.delete(this.target.id && 'playing')
                          playing.delete(this.user.id && 'playing')
                          }
                          collector1.stop()

                          this.status = 'tied'
                          this.positions = { u1: btns[0].label, u2: btns[1].label, u3: btns[2].label, m1: btns[3].label, m2: btns[4].label, m3: btns[5].label, d1: btns[6].label, d2: btns[7].label, d3: btns[8].label }
                          if (this.gameClient.emitEvents) this.gameClient.emit('tictactoeEnd', this)

                          return i.editReply({ embeds: [embed], components: [] })
                      }
                     const row1 = new MessageActionRow()
                     .addComponents(
                      new MessageButton()
                      .setCustomId(btns[0].customId)
                      .setLabel(btns[0].label)
                      .setStyle(btns[0].style)
                      .setDisabled(btns[0].disabled),
                      new MessageButton()
                      .setCustomId(btns[1].customId)
                      .setLabel(btns[1].label)
                      .setStyle(btns[1].style)
                      .setDisabled(btns[1].disabled),
                      new MessageButton()
                      .setCustomId(btns[2].customId)
                      .setLabel(btns[2].label)
                      .setStyle(btns[2].style)
                      .setDisabled(btns[2].disabled)
                     )
                     const row2 = new MessageActionRow()
                     .addComponents(
                         new MessageButton()
                         .setCustomId(btns[3].customId)
                         .setLabel(btns[3].label)
                         .setStyle(btns[3].style)
                         .setDisabled(btns[3].disabled),
                         new MessageButton()
                         .setCustomId(btns[4].customId)
                         .setLabel(btns[4].label)
                         .setStyle(btns[4].style)
                         .setDisabled(btns[4].disabled),
                         new MessageButton()
                         .setCustomId(btns[5].customId)
                         .setLabel(btns[5].label)
                         .setStyle(btns[5].style)
                         .setDisabled(btns[5].disabled)


                     )
                     const row3 = new MessageActionRow()
                     .addComponents(
                      new MessageButton()
                      .setCustomId(btns[6].customId)
                      .setLabel(btns[6].label)
                      .setStyle(btns[6].style)
                      .setDisabled(btns[6].disabled),
                      new MessageButton()
                      .setCustomId(btns[7].customId)
                      .setLabel(btns[7].label)
                      .setStyle(btns[7].style)
                      .setDisabled(btns[7].disabled),
                      new MessageButton()
                      .setCustomId(btns[8].customId)
                      .setLabel(btns[8].label)
                      .setStyle(btns[8].style)
                      .setDisabled(btns[8].disabled)
                     )


                     turnEmoji = this.oEmoji

                  i.editReply({ embeds: [embed.setDescription(`${this.target.toString()}, ${Dictionary.haveToPlay} ${this.oEmoji}`)], components: [row1, row2, row3] })
                  }
         })
        }
        if (i.customId === 'decline'){
            if (!this.gameClient.playMoreThanOne){
            playing.delete(this.user.id && 'requesting')
            playing.delete(this.target.id && 'requesting')
            }
            await i.deferUpdate()
            if (i.user !== this.target) return i.reply({ content: Dictionary.Decision, ephemeral: true })
           const embed = new MessageEmbed()
             .setTitle(`:x: ${Dictionary.Denied}`)
             .setDescription(`${Dictionary.whoDenied} ${this.target.toString()}`)
             .setColor(this.timeoutEmbedColor)
             .setTimestamp()

          const newRow = new MessageActionRow()
            .addComponents(
            msg.components[0].components[0].setDisabled(),
            msg.components[0].components[1].setDisabled()
            )
            i.editReply({ components: [newRow], embeds: [embed] })

           collector.stop()
        }
    })
    collector.on('end', async(collected, reason) => {
        if (!this.gameClient.playMoreThanOne){
            playing.delete(this.user.id && 'requesting')
            playing.delete(this.target.id && 'requesting')
            }
        if (reason === 'time'){
            const embed = new MessageEmbed()
            .setTitle(`:x: ${Dictionary.timeout}`)
            .setDescription(Dictionary.timeoutMessage)
            .setColor(this.timeoutEmbedColor)
            .setTimestamp()

            const newRow = new MessageActionRow()
            .addComponents(
            msg.components[0].components[0].setDisabled(),
            msg.components[0].components[1].setDisabled()
            )
            msg.edit({ components: [newRow], embeds: [embed] })
         }

    })
}

    }


export interface TicTacToeOptions{
embedColor?: ColorResolvable
timeout?: number
xEmoji?: string
oEmoji?: string
_emoji?:string
embedFooter?: string
timeoutEmbedColor?: ColorResolvable
}


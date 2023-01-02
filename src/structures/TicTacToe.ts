
import { CommandInteraction, User, ColorResolvable, Message, TextBasedChannel, ComponentType, APIButtonComponentWithCustomId, APIButtonComponent, InteractionResponse } from 'discord.js'
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} from 'discord.js'
import { Client } from './Client'
import { isUser, isInteraction, isClient } from '../util/Preconditions'
import Languages from '../util/Languages.json'
const playing = new Set()


export class TicTacToe implements TicTacToeOptions{
	public textChannel?: TextBasedChannel
	public embedColor?: ColorResolvable
	public winner? : User | null
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
		this.embedColor = options?.embedColor ?? 'Blue'
		this.xEmoji = options?.xEmoji ?? '❌​'
		this.oEmoji = options?.oEmoji ?? '⭕​'
		this._emoji = options?._emoji ?? '➖'
		this.embedFooter = options?.embedFooter ?? Languages.TicTacToe[this.gameClient.language].embedFooter
		this.timeoutEmbedColor = options?.timeoutEmbedColor ?? 'Red'
		this.positions = {}
		this.status = null
		this.textChannel = this.interaction.channel
		this.winner = null


	}

	public async play() : Promise<void | InteractionResponse<boolean>> {
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
		const btns: ButtonBuilder[] = [

			new ButtonBuilder()
				.setCustomId('u1')
				.setStyle(ButtonStyle.Secondary)
				.setLabel(`${this._emoji}`),
			new ButtonBuilder()
				.setCustomId('u2')
				.setStyle(ButtonStyle.Secondary)
				.setLabel(`${this._emoji}`),
			new ButtonBuilder()
				.setCustomId('u3')
				.setStyle(ButtonStyle.Secondary)
				.setLabel(`${this._emoji}`),
			new ButtonBuilder()
				.setCustomId('m1')
				.setStyle(ButtonStyle.Secondary)
				.setLabel(`${this._emoji}`),
			new ButtonBuilder()
				.setCustomId('m2')
				.setStyle(ButtonStyle.Secondary)
				.setLabel(`${this._emoji}`),
			new ButtonBuilder()
				.setCustomId('m3')
				.setStyle(ButtonStyle.Secondary)
				.setLabel(`${this._emoji}`),
			new ButtonBuilder()
				.setCustomId('d1')
				.setStyle(ButtonStyle.Secondary)
				.setLabel(`${this._emoji}`),
			new ButtonBuilder()
				.setCustomId('d2')
				.setStyle(ButtonStyle.Secondary)
				.setLabel(`${this._emoji}`),
			new ButtonBuilder()
				.setCustomId('d3')
				.setStyle(ButtonStyle.Secondary)
				.setLabel(`${this._emoji}`)
		]

		const embed = new EmbedBuilder()
			.setTitle('TicTacToe')
			.setDescription(`${this.target.toString()}, ${Dictionary.requestEmbedDescription}`)
			.setColor(this.embedColor)
			.setFooter({ text: this.embedFooter })


		const row = new ActionRowBuilder<ButtonBuilder>()
			.addComponents([
				new ButtonBuilder()
					.setCustomId('accept')
					.setLabel(Dictionary.Accept)
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('decline')
					.setLabel(Dictionary.Decline)
					.setStyle(ButtonStyle.Danger)
			])

		const msg = await this.interaction.reply({ embeds: [embed], components: [row], fetchReply: true }) as Message
		const collector = msg.createMessageComponentCollector({ time: this.timeout, max: 1, componentType: ComponentType.Button })
		if (!this.gameClient.playMoreThanOne){
			playing.add(this.user.id && 'requesting')
			playing.add(this.target.id && 'requesting')
		}
		collector.on('collect', async(i): Promise<any> => {
			await i.deferUpdate()
			if (i.customId === 'accept'){
				if (!this.gameClient.playMoreThanOne){
					playing.delete(this.user.id && 'requesting')
					playing.delete(this.target.id && 'requesting')
				}
				if (i.user !== this.target) return i.followUp({ content: Dictionary.noChallenged, ephemeral: true })
				i.followUp({ content: Dictionary.Accepted, ephemeral: true })
				collector.stop()
				if (!this.gameClient.playMoreThanOne){
					playing.add(this.user.id && 'playing')
					playing.add(this.target.id && 'playing')
				}
				const embed = new EmbedBuilder()
					.setTitle('TicTacToe')
					.setDescription(`${this.target.toString()}, ${Dictionary.haveToPlay} ${this.oEmoji}`)
					.setFooter({ text: this.embedFooter })
					.setColor(this.embedColor)

				const row1 = new ActionRowBuilder<ButtonBuilder>()
					.addComponents([

						btns[0],
						btns[1],
						btns[2]
					])
				const row2 = new ActionRowBuilder<ButtonBuilder>()
					.addComponents([
						btns[3],
						btns[4],
						btns[5]

					])
				const row3 = new ActionRowBuilder<ButtonBuilder>()
					.addComponents([
						btns[6],
						btns[7],
						btns[8]
					])

				msg.edit({ embeds: [embed], components: [row1, row2, row3] })
				const collector1 = msg.createMessageComponentCollector({ componentType: ComponentType.Button })
				let turnEmoji = this.oEmoji
				collector1.on('collect', async(i): Promise<any> => {
					await i.deferUpdate()

					if (this.oEmoji === turnEmoji && i.user !== this.target) return i.followUp({ content: i.user === this.interaction.user? Dictionary.isNotYourTurn: Dictionary.isNotPlaying, ephemeral: true })
					if (this.xEmoji === turnEmoji && i.user !== this.interaction.user) return i.followUp({ content: i.user === this.target? Dictionary.isNotYourTurn: Dictionary.isNotPlaying, ephemeral: true })
					if (turnEmoji === this.oEmoji && i.user === this.target){
						const btn = btns.filter(b => (b.data as APIButtonComponentWithCustomId).custom_id === i.customId)
						btn[0].data.label = this.oEmoji
						btn[0].setDisabled()
						btn[0].data.style = ButtonStyle.Danger


						const row1 = new ActionRowBuilder<ButtonBuilder>()
							.addComponents([
								btns[0],
								btns[1],
								btns[2]
							])
						const row2 = new ActionRowBuilder<ButtonBuilder>()
							.addComponents([
								btns[3],
								btns[4],
								btns[5]

							])
						const row3 = new ActionRowBuilder<ButtonBuilder>()
							.addComponents([
								btns[6],
								btns[7],
								btns[8]
							])


						turnEmoji = this.xEmoji
						if (btns[0].data.label === btns[3].data.label && btns[0].data.label === btns[6].data.label && btns[0].data.label !== `${this._emoji}`|| btns[1].data.label === btns[4].data.label && btns[1].data.label === btns[7].data.label && btns[1].data.label !== `${this._emoji}` || btns[2].data.label
                     === btns[5].data.label && btns[2].data.label === btns[8].data.label && btns[2].data.label !== `${this._emoji}`|| btns[0].data.label === btns[1].data.label && btns[0].data.label === btns[2].data.label && btns[0].data.label !== `${this._emoji}`|| btns[3].data.label === btns[4].data.label && btns[3].data.label === btns[5].data.label && btns[3].data.label !== `${this._emoji}`||
                     btns[6].data.label === btns[7].data.label && btns[6].data.label === btns[8].data.label && btns[6].data.label !== `${this._emoji}`|| btns[0].data.label === btns[4].data.label && btns[0].data.label === btns[8].data.label && btns[0].data.label !== `${this._emoji}`|| btns[2].data.label === btns[4].data.label && btns[2].data.label === btns[6].data.label && btns[2].data.label !== `${this._emoji}`){
							const embed = new EmbedBuilder()
								.setTitle(Dictionary.Ended)
								.setDescription(`${Dictionary.winnerMessage} ${this.target.toString()}\n${btns[0].data.label} | ${btns[1].data.label} | ${btns[2].data.label}\n${btns[3].data.label} | ${btns[4].data.label} | ${btns[5].data.label}\n${btns[6].data.label} | ${btns[7].data.label} | ${btns[8].data.label}`)
								.setColor(this.embedColor)
								.setTimestamp()

							collector1.stop()
							if (!this.gameClient.playMoreThanOne){
								playing.delete(this.target.id && 'playing')
								playing.delete(this.user.id && 'playing')
							}
							this.status = 'won'
							this.winner = this.target
							this.positions = { u1: btns[0].data.label, u2: btns[1].data.label, u3: btns[2].data.label, m1: btns[3].data.label, m2: btns[4].data.label, m3: btns[5].data.label, d1: btns[6].data.label, d2: btns[7].data.label, d3: btns[8].data.label }
							if (this.gameClient.emitEvents) this.gameClient.emit('tictactoeEnd', this)
							return i.editReply({ embeds: [embed], components: [] })
						}
						if (btns.filter(b => b.data.label !== `${this._emoji}`).length === 9){
							const embed = new EmbedBuilder()
								.setTitle(Dictionary.Tied)
								.setDescription(`${btns[0].data.label} | ${btns[1].data.label} | ${btns[2].data.label}\n${btns[3].data.label} | ${btns[4].data.label} | ${btns[5].data.label}\n${btns[6].data.label} | ${btns[7].data.label} | ${btns[8].data.label}`)
								.setColor(this.embedColor)
								.setTimestamp()

							if (!this.gameClient.playMoreThanOne){
								playing.delete(this.target.id && 'playing')
								playing.delete(this.user.id && 'playing')
							}

							this.status = 'tied'
							this.positions = { u1: btns[0].data.label, u2: btns[1].data.label, u3: btns[2].data.label, m1: btns[3].data.label, m2: btns[4].data.label, m3: btns[5].data.label, d1: btns[6].data.label, d2: btns[7].data.label, d3: btns[8].data.label }
							if (this.gameClient.emitEvents) this.gameClient.emit('tictactoeEnd', this)
							return i.editReply({ embeds: [embed], components: [] })
						}

						i.editReply({ embeds: [embed.setDescription(`${this.interaction.user.toString()}, ${Dictionary.haveToPlay} ${this.xEmoji}`)], components: [row1, row2, row3] })
					}
					if (turnEmoji === this.xEmoji && i.user === this.interaction.user){
						const btn = btns.filter(b => (b.data as APIButtonComponentWithCustomId).custom_id === i.customId)
						btn[0].data.label = this.xEmoji
						btn[0].setDisabled()
						btn[0].data.style = ButtonStyle.Primary

						if (btns[0].data.label === btns[3].data.label && btns[0].data.label === btns[6].data.label && btns[0].data.label !== `${this._emoji}`|| btns[1].data.label === btns[4].data.label && btns[1].data.label === btns[7].data.label && btns[1].data.label !== `${this._emoji}` || btns[2].data.label
                     === btns[5].data.label && btns[2].data.label === btns[8].data.label && btns[2].data.label !== `${this._emoji}`|| btns[0].data.label === btns[1].data.label && btns[0].data.label === btns[2].data.label && btns[0].data.label !== `${this._emoji}`|| btns[3].data.label === btns[4].data.label && btns[3].data.label === btns[5].data.label && btns[3].data.label !== `${this._emoji}`||
                     btns[6].data.label === btns[7].data.label && btns[6].data.label === btns[8].data.label && btns[6].data.label !== `${this._emoji}`|| btns[0].data.label === btns[4].data.label && btns[0].data.label === btns[8].data.label && btns[0].data.label !== `${this._emoji}`|| btns[2].data.label === btns[4].data.label && btns[2].data.label === btns[6].data.label && btns[2].data.label !== `${this._emoji}`){
							const embed = new EmbedBuilder()
								.setTitle(Dictionary.Ended)
								.setDescription(`${Dictionary.winnerMessage} ${this.user.toString()}\n${btns[0].data.label} | ${btns[1].data.label} | ${btns[2].data.label}\n${btns[3].data.label} | ${btns[4].data.label} | ${btns[5].data.label}\n${btns[6].data.label} | ${btns[7].data.label} | ${btns[8].data.label}`)
								.setColor(this.embedColor)
								.setTimestamp()

							if (!this.gameClient.playMoreThanOne){
								playing.delete(this.target.id && 'playing')
								playing.delete(this.user.id && 'playing')
							}

							collector1.stop()
							this.status = 'won'
							this.winner = this.user
							this.positions = { u1: btns[0].data.label, u2: btns[1].data.label, u3: btns[2].data.label, m1: btns[3].data.label, m2: btns[4].data.label, m3: btns[5].data.label, d1: btns[6].data.label, d2: btns[7].data.label, d3: btns[8].data.label }
							if (this.gameClient.emitEvents) this.gameClient.emit('tictactoeEnd', this)
							return i.editReply({ embeds: [embed], components: [] })
						}
						if (btns.filter(b => b.data.label !== `${this._emoji}`).length === 9){
							const embed = new EmbedBuilder()
								.setTitle(Dictionary.Tied)
								.setDescription(`${btns[0].data.label} | ${btns[1].data.label} | ${btns[2].data.label}\n${btns[3].data.label} | ${btns[4].data.label} | ${btns[5].data.label}\n${btns[6].data.label} | ${btns[7].data.label} | ${btns[8].data.label}`)
								.setColor(this.embedColor)
								.setTimestamp()
							if (!this.gameClient.playMoreThanOne){
								playing.delete(this.target.id && 'playing')
								playing.delete(this.user.id && 'playing')
							}
							collector1.stop()

							this.status = 'tied'
							this.positions = { u1: btns[0].data.label, u2: btns[1].data.label, u3: btns[2].data.label, m1: btns[3].data.label, m2: btns[4].data.label, m3: btns[5].data.label, d1: btns[6].data.label, d2: btns[7].data.label, d3: btns[8].data.label }
							if (this.gameClient.emitEvents) this.gameClient.emit('tictactoeEnd', this)

							return i.editReply({ embeds: [embed], components: [] })
						}
						const row1 = new ActionRowBuilder<ButtonBuilder>()
							.addComponents([
								btns[0],
								btns[1],
								btns[2]
							])
						const row2 = new ActionRowBuilder<ButtonBuilder>()
							.addComponents([
								btns[3],
								btns[4],
								btns[5]
							])
						const row3 = new ActionRowBuilder<ButtonBuilder>()
							.addComponents([
								btns[6],
								btns[7],
								btns[8]
							])


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
				if (i.user !== this.target) return i.followUp({ content: Dictionary.Decision, ephemeral: true })
				const embed = new EmbedBuilder()
					.setTitle(`:x: ${Dictionary.Denied}`)
					.setDescription(`${Dictionary.whoDenied} ${this.target.toString()}`)
					.setColor(this.timeoutEmbedColor)
					.setTimestamp()

				const newRow = new ActionRowBuilder<ButtonBuilder>()
					.addComponents(
						ButtonBuilder.from(msg.components[0].components[0] as APIButtonComponent).setDisabled(),
						ButtonBuilder.from(msg.components[0].components[1] as APIButtonComponent).setDisabled()
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
				const embed = new EmbedBuilder()
					.setTitle(`:x: ${Dictionary.timeout}`)
					.setDescription(Dictionary.timeoutMessage)
					.setColor(this.timeoutEmbedColor)
					.setTimestamp()

				const newRow = new ActionRowBuilder<ButtonBuilder>()
					.addComponents(
						ButtonBuilder.from(msg.components[0].components[0] as APIButtonComponent).setDisabled(),
						ButtonBuilder.from(msg.components[0].components[1] as APIButtonComponent).setDisabled()
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


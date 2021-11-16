const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const db = require('quick.db')
module.exports = {
    createGoldenChannelInsideGuild: async function (guild) {
        const goldenChannel = await guild.channels.create(
            'golden-song-requests',
            {
                type: 'text',
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone,
                        allow: ['VIEW_CHANNEL'],
                    },
                ],
            }
        )

        await db.set(guild.id, { channel: goldenChannel.id })
        return goldenChannel
    },

    /* * * * * * * * * * * */

    populateGoldenChannelInsideGuild: async function (guild) {
        const goldenChannelId = await db.get(guild.id).channel
        const goldenChannel = await guild.channels.cache.get(goldenChannelId)

        /*       */

        const goldenChannelControlComponents = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('playpause')
                    .setEmoji('⏯')
                    .setStyle('SECONDARY')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('stop')
                    .setEmoji('⏹')
                    .setStyle('SECONDARY')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('skip')
                    .setEmoji('⏭')
                    .setStyle('SECONDARY')
            )

        const goldenChannelEmbed = new MessageEmbed()
            .setColor('#C04BF7')
            .setTitle('Derzeit wird kein Lied abgespielt')
            .setDescription(
                '[Bot Invite](https://example.com) | [Dashboard](https://www.golden.spasten.studio) | [Commands](https://example.com) | [Support](https://discord.gg/PX28nyVgdP)'
            )
            .setImage('https://cdn.hydra.bot/hydra_no_music.png')
        /*       */

        const goldenBanner = await goldenChannel.send(
            'https://cdn.discordapp.com/attachments/888129386124038174/888129397293461574/hydra_banner.png'
        )
        const goldenMessage = await goldenChannel.send({
            content:
                'ㅤ\n__**Wiedergabeliste:**__\nVerbinde dich mit einem Sprachkanal\nund füge Songs über Titel oder URL ein.',
            embeds: [goldenChannelEmbed],
            components: [goldenChannelControlComponents],
        })

        await db.set(guild.id, {
            channel: goldenChannel.id,
            banner: goldenBanner.id,
            request: goldenMessage.id,
        }) //Note: overwriting existing channel parameter, that was already set inside createChannel() function!
    },

    /* * * * * * * * * * * */

    deleteGoldenChannelInsideGuild: async function (guild) {
        const goldenChannelId = await db.get(guild.id).channel
        const goldenChannel = await guild.channels.cache.get(goldenChannelId)

        return goldenChannel.delete()
    },

    /* * * * * * * * * * * */

    goldenChannelExistsInGuild: function (guild) {
        return (
            db.has(guild.id) &&
            guild.channels.cache.get(db.get(guild.id).channel) !== undefined
        )
    },

    /* * * * * * * * * * * */

    setGoldenChannelPlayerThumbnail: async function (guild, imageUrl) {
        if (module.exports.goldenChannelExistsInGuild(guild)) {
            const goldenChannelId = await db.get(guild.id).channel // ID of the golden channel for this guild
            const goldenChannelRequestId = await db.get(guild.id).request // ID of the player Embed inside the golden channel

            const goldenChannel = await guild.channels.cache.get(
                goldenChannelId
            ) // Fetched channel
            const goldenChannelPlayerMessage =
                await goldenChannel.messages.fetch(goldenChannelRequestId) // Fetched player embed

            goldenChannelPlayerMessage.embeds[0].image.url = imageUrl

            goldenChannelPlayerMessage.edit({
                embeds: [
                    new MessageEmbed(goldenChannelPlayerMessage.embeds[0]),
                ],
            })
        }
    },

    /* * * * * * * * * * * */

    setGoldenChannerlPlayerQueue: async function (guild, queue) {
        if (module.exports.goldenChannelExistsInGuild(guild)) {
            const goldenChannelId = await db.get(guild.id).channel // ID of the golden channel for this guild
            const goldenChannelRequestId = await db.get(guild.id).request // ID of the player Embed inside the golden channel

            const goldenChannel = await guild.channels.cache.get(
                goldenChannelId
            ) // Fetched channel
            const goldenChannelPlayerMessage =
                await goldenChannel.messages.fetch(goldenChannelRequestId) // Fetched player embed

            goldenChannelPlayerMessage.edit({
                //content: "ㅤ\n__Queue list:__\n1. KA SO NEN SONG"
                content: `ㅤ\n**__Queue list:__**\n${queue}`,
            })
        }
    },

    /* * * * * * * * * * * */

    setGoldenChannerlPlayerTitle: async function (guild, client, title) {
        if (module.exports.goldenChannelExistsInGuild(guild)) {
            const goldenChannelId = await db.get(guild.id).channel // ID of the golden channel for this guild
            const goldenChannelRequestId = await db.get(guild.id).request // ID of the player Embed inside the golden channel

            const goldenChannel = await guild.channels.cache.get(
                goldenChannelId
            ) // Fetched channel
            const goldenChannelPlayerMessage =
                await goldenChannel.messages.fetch(goldenChannelRequestId) // Fetched player embed

            goldenChannelPlayerMessage.embeds[0].author = {
                name: title,
                iconURL: client.user.displayAvatarURL(),
            }
            goldenChannelPlayerMessage.embeds[0].title = ''
            goldenChannelPlayerMessage.embeds[0].description = ''

            goldenChannelPlayerMessage.edit({
                embeds: [
                    new MessageEmbed(goldenChannelPlayerMessage.embeds[0]),
                ],
            })
        }
    },

    /* * * * * * * * * * * */

    resetGoldenChannelPlayer: async function (guild) {
        if (module.exports.goldenChannelExistsInGuild(guild)) {
            const goldenChannelId = await db.get(guild.id).channel // ID of the golden channel for this guild
            const goldenChannelRequestId = await db.get(guild.id).request // ID of the player Embed inside the golden channel

            const goldenChannel = await guild.channels.cache.get(
                goldenChannelId
            ) // Fetched channel
            const goldenChannelPlayerMessage =
                await goldenChannel.messages.fetch(goldenChannelRequestId) // Fetched player embed

            goldenChannelPlayerMessage.embeds[0].author = {}
            goldenChannelPlayerMessage.embeds[0].title =
                'Derzeit wird kein Lied abgespielt'
            goldenChannelPlayerMessage.embeds[0].description =
                '[Invite](https://example.com) | [Dashboard](https://example.com) | [Commands](https://example.com) | [Support](https://example.com)'
            goldenChannelPlayerMessage.embeds[0].image.url =
                'https://cdn.hydra.bot/hydra_no_music.png'

            goldenChannelPlayerMessage.edit({
                content:
                    'ㅤ\n__**Wiedergabeliste:**__\nVerbinde dich mit einem Sprachkanal\nund füge Songs über Titel oder URL ein.',
                embeds: [
                    new MessageEmbed(goldenChannelPlayerMessage.embeds[0]),
                ],
            })
        }
    },

    /* * * * * * * * * * * */

    setGoldenChannelPlayerFooter: async function (guild, footer) {
        if (module.exports.goldenChannelExistsInGuild(guild)) {
            const goldenChannelId = await db.get(guild.id).channel // ID of the golden channel for this guild
            const goldenChannelRequestId = await db.get(guild.id).request // ID of the player Embed inside the golden channel

            const goldenChannel = await guild.channels.cache.get(
                goldenChannelId
            ) // Fetched channel
            const goldenChannelPlayerMessage =
                await goldenChannel.messages.fetch(goldenChannelRequestId) // Fetched player embed

            //goldenChannelPlayerMessage.embeds[0].footer = { text: "0 songs in queu | Volume: 100%" }
            goldenChannelPlayerMessage.embeds[0].footer = { text: footer }

            goldenChannelPlayerMessage.edit({
                embeds: [
                    new MessageEmbed(goldenChannelPlayerMessage.embeds[0]),
                ],
            })
        }
    },

    /* * * * * * * * * * * */

    sendTimed: function (channel, text, duration = 10) {
        channel.send(text).then((message) => {
            if (duration === -1) {
                return
            }

            setTimeout(() => {
                message.delete().catch()
            }, 1000 * duration)
        })
    },

    /* * * * * * * * * * * */
}

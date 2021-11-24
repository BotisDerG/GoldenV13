const { MessageEmbed, ReactionUserManager } = require('discord.js')
const { getVoiceConnection } = require('@discordjs/voice')
const { isGoldenChannel, sendTimed, resetGoldenChannelPlayer } = require('../functions/channel')

module.exports = {
    skip: async function (interaction, client, skipAmount) {
        const guild = interaction.guild
        const channel = interaction.channel

        if(getVoiceConnection(guild.id) === undefined) {
            return; // golden not in a voice channel rn - do nothing
        } else if(getVoiceConnection(guild.id).joinConfig.channelId !== interaction.member.voice.channelId) {
            const ReturnEmbed = {
                title: 'Join My Channel',
                description:
                    "Please join my voice channel to use this interaction",
            }
            
            return (await sendTimed(channel, { embeds: [ReturnEmbed] }, 5))
        }

        const Queue = client.player.GetQueue(guild.id)
        if (!Queue || (Queue && !Queue.tracks[1])) {

            const success = await Queue.destroy()
            if (success && !isGoldenChannel(guild, channel)) {
                const ReturnEmbed = {
                    title: 'Songs has been Stopped',
                }
                resetGoldenChannelPlayer(guild)
                return (await interaction.editReply({ embeds: [ReturnEmbed] }))
            } else if (success) {
                return resetGoldenChannelPlayer(guild)
            }
           const ErrorEmbed = {
               title: "Songs can't be Stopped",
           }
   
           if (isGoldenChannel(guild, channel))
               return (await interaction.channel.send({
                   embeds: [ErrorEmbed],
               }))
   
           return (await interaction.editReply({ embeds: [ErrorEmbed] }))
            /*const ErrorEmbed = {
                title: 'Empty Queue',
                description:
                    "No Songs are playing in `Queue`\nOR, Next Track is not Present in Queue\nSongs can't be `Skipped`",
            }

            if (isGoldenChannel(guild, channel))
                return (await interaction.channel.send({
                    embeds: [ErrorEmbed],
                }))

            return (await interaction.editReply({ embeds: [ErrorEmbed] }))*/
        }
        const success = Queue.skip(skipAmount ?? undefined)
        if (success && !isGoldenChannel(guild, channel)) {
            const ReturnEmbed = {
                title: 'Songs has been Skipped',
            }
            return (await interaction.editReply({ embeds: [ReturnEmbed] }))
        } else if (success) {
            // Song skipped successfully inside the golden channel - no message to send!
            return
        }

        const ErrorEmbed = {
            title: "Songs can't be Skipped",
        }

        if (isGoldenChannel(guild, channel))
            return (await interaction.channel.send({
                emebds: [ErrorEmbed],
            }))

        return (await interaction.editReply({ embeds: [ErrorEmbed] }))
    },

    stop: async function (interaction, client) {
        const guild = interaction.guild
        const channel = interaction.channel
        
        if(getVoiceConnection(guild.id) === undefined) {
            return; // golden not in a voice channel rn - do nothing
        } else if(getVoiceConnection(guild.id).joinConfig.channelId !== interaction.member.voice.channelId) {
            const ReturnEmbed = {
                title: 'Join My Channel',
                description:
                    "Please join my voice channel to use this interaction",
            }
            
            return (await sendTimed(channel, { embeds: [ReturnEmbed] }, 5))
        }

        const Queue = client.player.GetQueue(guild.id)
        if (!Queue || (Queue && !Queue.current)) {
            const ErrorEmbed = {
                title: 'Empty Queue',
                description:
                    "No Songs are playing in `Queue`\nSongs can't be `Stopped`",
            }

            if (isGoldenChannel(guild, channel))
                return (await interaction.channel.send({
                    embeds: [ErrorEmbed],
                }))

            return (await interaction.editReply({ embeds: [ErrorEmbed] }))
        }

         const success = await Queue.destroy()
         if (success && !isGoldenChannel(guild, channel)) {
             const ReturnEmbed = {
                 title: 'Songs has been Stopped',
             }
             resetGoldenChannelPlayer(guild)
             return (await interaction.editReply({ embeds: [ReturnEmbed] }))
         } else if (success) {
             return resetGoldenChannelPlayer(guild)
         }
        const ErrorEmbed = {
            title: "Songs can't be Stopped",
        }

        if (isGoldenChannel(guild, channel))
            return (await interaction.channel.send({
                embeds: [ErrorEmbed],
            }))

        return (await interaction.editReply({ embeds: [ErrorEmbed] }))
    },

    playpause: async function (interaction, client) {
        const guild = interaction.guild
        const channel = interaction.channel

        if(getVoiceConnection(guild.id) === undefined) {
            return; // golden not in a voice channel rn - do nothing
        } else if(getVoiceConnection(guild.id).joinConfig.channelId !== interaction.member.voice.channelId) {
            const ReturnEmbed = {
                title: 'Join My Channel',
                description:
                    "Please join my voice channel to use this interaction",
            }
            
            return (await sendTimed(channel, { embeds: [ReturnEmbed] }, 5))
        }

        const Queue = client.player.GetQueue(guild.id)
        if (!Queue || (Queue && !Queue.tracks[0])) {
            const ErrorEmbed = {
                title: 'Empty Queue',
                description:
                    "No Songs are playing in `Queue`\nOR, Next Track is not Present in Queue\nSongs can't be `Resumed/Un-Paused`",
            }

            if (isGoldenChannel(guild, channel))
                return (await interaction.channel.send({
                    embeds: [ErrorEmbed],
                }))

            return (await interaction.editReply({ embeds: [ErrorEmbed] }))
        }

        if (Queue.paused) {
            const success = Queue.resume()
            if (success && !isGoldenChannel(guild, channel)) {
                const ReturnEmbed = {
                    title: 'Songs has been Resumed/Un-Paused',
                }
                return (await interaction.editReply({
                    embeds: [ReturnEmbed],
                }))
            } else if (success) {
                // Success inside golden channel - no return needed
                return
            }
            const ErrorEmbed = {
                title: "Songs can't be Resumed/Un-Paused",
            }
            return (await interaction.editReply({ embeds: [ErrorEmbed] }))
        } else {
            const success = Queue.pause()
            if (success && !isGoldenChannel(guild, channel)) {
                const ReturnEmbed = {
                    title: 'Songs has been Paused',
                }
                return (await interaction.editReply({
                    embeds: [ReturnEmbed],
                }))
            } else if (success) {
                // Success in golden channel - no return message needed
                return
            }
            const ErrorEmbed = {
                title: "Songs can't be Paused",
            }
            return (await interaction.editReply({ embeds: [ErrorEmbed] }))
        }
    },

    shuffle: async function(interaction, client) {

        const guild = interaction.guild;
        const channel = interaction.channel;

        var Queue = client.player.GetQueue(guild.id)
        if (!Queue || (Queue && !Queue.playing)) {
          const ErrorEmbed = {
            title: 'Empty Queue',
            description:
              "No Songs are playing in `Queue`\nShuffle can't be implemented",
          }

          if (isGoldenChannel(guild, channel))
            return (await interaction.channel.send({
                embeds: [ErrorEmbed],
            }))

          return (await interaction.editReply({ embeds: [ErrorEmbed] }))
        }
        const success = Queue.shuffle()
        if (success) {
          const ReturnEmbed = {
            title: `Tracks Data has been Shuffled Completely`,
          }

          if (isGoldenChannel(guild, channel))
            return (await interaction.channel.send({
                embeds: [ReturnEmbed],
            }))

          return (await interaction.editReply({ embeds: [ReturnEmbed] }))
        }
        const ErrorEmbed = {
          title: `Tracks Data can't be Shuffled`,
        }

        if (isGoldenChannel(guild, channel))
            return (await interaction.channel.send({
                embeds: [ErrorEmbed],
            }))


        return (await interaction.editReply({ embeds: [ErrorEmbed] }))

    },
}
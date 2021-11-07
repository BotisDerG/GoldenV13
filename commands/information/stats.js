const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const path = require('path')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('provides a helpful amount of information!'),

    category: path.basename(__dirname),
    async execute(interaction, client) {
        const embed = new MessageEmbed()
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTimestamp()

        const sent = await interaction.reply({
            embeds: [embed.setDescription(`**Pinging...**`).setColor('RED')],
            fetchReply: true,
        })

        let totalSeconds = client.uptime / 1000
        let days = Math.floor(totalSeconds / 86400)
        totalSeconds %= 86400
        let hours = Math.floor(totalSeconds / 3600)
        totalSeconds %= 3600
        let minutes = Math.floor(totalSeconds / 60)
        let seconds = Math.floor(totalSeconds % 60)

        const usage = process.cpuUsage()

        interaction.editReply({
            embeds: [
                embed
                    .setTitle(`**${client.user.username} - Stats**`)
                    .setDescription('')
                    .addFields(
                        {
                            name: 'Uptime',
                            value: `${days} day${
                                days === 1 ? '' : 's'
                            }, ${hours} hour${
                                hours === 1 ? '' : 's'
                            }, ${minutes} minute${
                                minutes === 1 ? '' : 's'
                            } & ${seconds} second${seconds === 1 ? '' : 's'}`,
                        },
                        {
                            name: `Ping`,
                            value: `${
                                sent.createdTimestamp -
                                interaction.createdTimestamp
                            }ms`,
                            inline: true,
                        },
                        {
                            name: 'Discord API Ping',
                            value: `${client.ws.ping}ms`,
                            inline: true,
                        },
                        {
                            name: 'RAM usage',
                            value: `${
                                Math.round(
                                    (process.memoryUsage().heapUsed /
                                        1024 /
                                        1024) *
                                        100
                                ) / 100
                            }MB\n`,
                            inline: true,
                        },
                        {
                            name: 'CPU usage',
                            value: `${process.cpuUsage(usage).user} %`,
                            inline: true,
                        }
                    )
                    .setColor('DARK_GREEN'),
            ],
        })
    },
}
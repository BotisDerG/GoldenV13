const { SlashCommandBuilder } = require("@discordjs/builders");
const { resetChannel, replyInteractionEmbed } = require('../../modules/channelModule/channelModule');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop playing music"),

  async execute(interaction, client)
  {
    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player) return replyInteractionEmbed(interaction, '', 'Play a track before using this command.', 'DARK_RED');

    const { channel } = interaction.member.voice;

    if (!channel) return replyInteractionEmbed(interaction, '', 'Join a voice channel first.', 'DARK_RED');
    if (channel.id !== player.voiceChannel) return replyInteractionEmbed(interaction, '', 'I\'ve to be in the same voice channel with you for requesting tracks.', 'DARK_RED');

    player.destroy();
    resetChannel(interaction.guild);
    return replyInteractionEmbed(interaction, '', 'Stopped playing and cleared queue.', 'DARK_GREEN');
  },
};

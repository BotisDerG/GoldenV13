const {
  getGuildChannel,
  setGuildChannel,
  setGuildChannelEmbed,
  setGuildChannelHero,
} = require("../../modules/databaseModule/databaseModule");
const {
  createChannel,
  deleteChannel,
  populateChannel,
  setEmbed,
} = require("../../modules/channelModule/channelModule");

const {
  playPause,
  stop,
  skip,
  shuffle
} = require("../../modules/musicControllerModule/musicControllerModule");
const { createEmbed } = require("../../modules/embedModule/embedModule");

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction, client) {
    if (interaction.isButton()) {
      switch (interaction.customId) {

        // channel setup components
        case "cancelDeleteChannel":
          return interaction.update({
            embeds: [createEmbed('Channel creation cancelled', `Okay, I'll stick with my current channel <#${getGuildChannel(interaction.guild.id)}>`, 'GREY', 'https://cdn.discordapp.com/attachments/922836431045525525/922846375312498698/pop.png')],
            components: [],
          });

        case "deleteChannel":
          await deleteChannel(interaction.guild);

          const channel = await createChannel(interaction.guild);
          await setGuildChannel(interaction.guild.id, channel.id);
          const { channelHero, channelEmbed } = await populateChannel(interaction.guild);
          if(channelHero && channelEmbed === undefined) return interaction.deferUpdate();
          setGuildChannelEmbed(interaction.guild.id, channelEmbed.id);
          setGuildChannelHero(interaction.guild.id, channelHero.id);

          client.manager.players.filter(async (player) => {
            if (player.guild !== interaction.guild.id) return;

            const guild = await client.guilds.fetch(player.guild);
            if (guild === undefined) return;

            setEmbed(guild, player);
          });

          return interaction.update({
            embeds: [createEmbed('Channel creation successful', `I\'ve created my new channel successfully ${channel}\nJust send any track url or name into the channel and I'll do the rest.`, 'GREEN', 'https://cdn.discordapp.com/attachments/922836431045525525/922846375312498698/pop.png')],
            components: []
          })

        // music control components
        case "playpause":
          await interaction.deferUpdate();
          playPause(interaction);
          break;

        case "stop":
          await interaction.deferUpdate();
          stop(interaction);
          break;

        case "skip":
          await interaction.deferUpdate();
          skip(interaction);
          break;

        case "shuffle":
          await interaction.deferUpdate();
          shuffle(interaction);
          break;
      }

    } else if (interaction.isCommand()) {

      const command = client.commands.get(interaction.commandName);
      if (!command)
        return interaction.reply({
          content:
            "Interaction error, couldn't find that Command though.. Please report this error to an developer",
          ephemeral: true,
        });

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: `There was an issue executing the command: \`${error.toString()}\` Please report this error to an developer`,
          ephemeral: true,
        });
      }
    }
  },
};
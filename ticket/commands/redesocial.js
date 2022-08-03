const {
    SlashCommandBuilder
  } = require('@discordjs/builders');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('redesocial')
      .setDescription('Redes Sociais do Push Notify'),
    async execute(interaction, client) {
      const embed = new client.discord.MessageEmbed()
        .setColor('00000')
        .setAuthor('Redes Sociais')
        .setThumbnail(client.user.avatarURL())
        .setDescription('<a:7087fire:1002317469970595850> **Loja Oficial do Push Notify: Cloud SNKRS**\n<:6333instagram:1002317683603292170> ** Pushnotify.app** \n <:1129discord:1002317682403725404> https://discord.gg/jumu9GqX \n\n ◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤');
  
      await interaction.reply({
        embeds: [embed]
      });
    },
  };
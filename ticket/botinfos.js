const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Ajuda Push Notify'),
  async execute(interaction, client) {
    const embed = new client.discord.MessageEmbed()
      .setColor('ff9600')
      .setAuthor('Push Ticket', client.user.avatarURL())
      .setThumbnail(client.user.avatarURL())
      .setDescription('**Se precisar de Suporte abra um Ticket em** <#1002249151922307133>\n\n **Caso queira fazer uma pergunta a comunidade para todos responderem basta enviar la em** <#1002412374940209182>');

    await interaction.reply({
      embeds: [embed]
    });
  },
};
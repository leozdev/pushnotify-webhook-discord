const {
  SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsar um usúario.')
    .addUserOption(option =>
      option.setName('target')
      .setDescription('Expulsar um usúario')
      .setRequired(true))
    .addStringOption(option =>
        option.setName('raison')
        .setDescription('Motivo da expulsão')
        .setRequired(false)),
  async execute(interaction, client) {
    const user = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.options.getUser('target').id);
    const executer = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id);

    if (!executer.permissions.has(client.discord.Permissions.FLAGS.KICK_MEMBERS)) return interaction.reply({
      content: 'Você não tem permissão para este comando! (`KICK_MEMBERS`)',
      ephemeral: true
    });

    if (user.roles.highest.rawPosition > executer.roles.highest.rawPosition) return interaction.reply({
      content: 'Você não pode expulsar esse usúario!',
      ephemeral: true
    });

    if (!user.kickable) return interaction.reply({
      content: 'Eu não posso expulsar esse usúario',
      ephemeral: true
    });

    if (interaction.options.getString('raison')) {
      user.kick(interaction.options.getString('raison'))
      interaction.reply({
        content: `**${user.user.tag}** Foi expulso com sucesso!`
      });
    } else {
      user.kick()
      interaction.reply({
        content: `**${user.user.tag}** Foi expulso!`
      });
    };
  },
};
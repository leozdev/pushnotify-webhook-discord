const {
    SlashCommandBuilder
  } = require('@discordjs/builders');
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName('mute')
      .setDescription('Mutar um usúario')
      .addUserOption(option =>
        option.setName('target')
        .setDescription('Mutar Usúario')
        .setRequired(true))
      .addStringOption(option =>
        option.setName('reason')
        .setDescription('Motivo para mutar')
        .setRequired(false)),
    async execute(interaction, client) {
      const user = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.options.getUser('target').id);
      const executer = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id);
  
      if (!executer.permissions.has(client.discord.Permissions.FLAGS.BAN_MEMBERS)) return interaction.reply({
        content: 'Você não tem permissão para usar este comando! (`MUTE_MEMBERS`)',
        ephemeral: true
      });
  
      if (user.roles.highest.rawPosition > executer.roles.highest.rawPosition) return interaction.reply({
        content: 'Você não pode mutar esse usúario!',
        ephemeral: true
      });
  
      if (!user.bannable) return interaction.reply({
        content: 'Eu não posso mutar esse usúario',
        ephemeral: true
      });
  
      if (interaction.options.getString('raison')) {
        user.mute({
          reason: interaction.options.getString('raison'),
          days: 1
        });
        interaction.reply({
          content: `**${user.user.tag}** Foi mutado com sucesso!`
        });
      } else {
        user.mute({
          days: 1
        });
        interaction.reply({
          content: `**${user.user.tag}** Foi mutado!`
        });
      };
    },
  };
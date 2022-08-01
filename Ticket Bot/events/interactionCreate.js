let hastebin = require('hastebin');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (interaction.customId == "open-ticket") {

    const embed3 = new client.discord.MessageEmbed()
    .setAuthor('Push Ticket', client.user.avatarURL())
    .setTitle('📩 Um ticket foi aberto!')
    .setThumbnail(client.user.avatarURL())
    .setDescription(`<@&${client.config.roleSupport}>\n\n ◢◤◢◤◢◤◢◤◢◤◢◤◢◤◢◤`)
    .setColor('#2f3136')
    .setTimestamp();

    client.channels.cache.get(client.config.logsTicket).send({
        embeds: [embed3]
      });

      if (client.guilds.cache.get(interaction.guildId).channels.cache.find(c => c.topic == interaction.user.id)) {
        return interaction.reply({
          content: 'Você já tem um Ticket criado!',
          ephemeral: true
        });
      };

      interaction.guild.channels.create(`🙋┃ticket-${interaction.user.username}`, {
        parent: client.config.parentOpened,
        topic: interaction.user.id,
        permissionOverwrites: [{
            id: interaction.user.id,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
          },
          {
            id: client.config.roleSupport,
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
          },
          {
            id: interaction.guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          },
        ],
        type: 'text',
      }).then(async c => {
        interaction.reply({
          content: `O Ticket foi criado! <#${c.id}>`,
          ephemeral: true
        });
      
        const embed = new client.discord.MessageEmbed()
          .setColor('ff9600')
          .setAuthor('Push Ticket', client.user.avatarURL())
          .setTitle('Selecione o motivo do suporte:')
          .setDescription('Após selecionar o motivo, aguarde um pouco para que nossa equipe venha te responder!')

        const row = new client.discord.MessageActionRow()
          .addComponents(
            new client.discord.MessageSelectMenu()
            .setCustomId('category')
            .setPlaceholder('Selecione o motivo')
            .addOptions([
              {
                label: 'Suporte',
                value: 'Suporte',
                emoji: { name: '🙋' }
              },
              {
                label: 'Sugestões',
                value: 'Sugestões',
                emoji: { name: '💡' }
              },
              {
                label: 'Dúvidas',
                value: 'Dúvidas',
                emoji: { name: '❓' }
              },
              {
                label: 'Assinaturas',
                value: 'Assinaturas',
                emoji: { name: '🥇' }
              },
            ]),
          );

        msg = await c.send({
          content: `<@!${interaction.user.id}>`,
          embeds: [embed],
          components: [row]
        });

        const collector = msg.createMessageComponentCollector({
          componentType: 'SELECT_MENU',
          time: 20000
        });

        collector.on('collect', i => {
          if (i.user.id === interaction.user.id) {
            if (msg.deletable) {
              msg.delete().then(async () => {
                const embed = new client.discord.MessageEmbed()
                  .setColor('ff9600')
                  .setTitle('Ticket Criado com Sucesso!  📌')
                  .setThumbnail(client.user.avatarURL())
                  .setDescription(`Todos os responsáveis pelo ticket já estão cientes da abertura, basta aguardar alguém já irá lhe atender...\n\n **Você escolheu a categoria:** \n\`\`\` ${i.values[0]}\`\`\` \n\n**Caso deseje cancelar ou sair, basta clicar no botão vermelho.**\n\n`)
                  .setFooter("DESCREVA O MOTIVO DO CONTATO COM O MÁXIMO DE DETALHES POSSÍVEIS QUE ALGUM RESPONSÁVEL JÁ IRÁ LHE ATENDER!");

                const row = new client.discord.MessageActionRow()
                  .addComponents(
                    new client.discord.MessageButton()
                    .setCustomId('close-ticket')
                    .setLabel('Fechar Ticket')
                    .setEmoji('899745362137477181')
                    .setStyle('DANGER'),
                  );

                const opened = await c.send({
                  content: `<@&${client.config.roleSupport}>`,
                  embeds: [embed],
                  components: [row]
                });

                opened.pin().then(() => {
                  opened.channel.bulkDelete(1);
                });
              });
            };
            if (i.values[0] == '🙋 Suporte') {
              c.edit({
                parent: client.config.parentSuporte
              });
            };
            if (i.values[0] == '💡 Sugestões') {
              c.edit({
                parent: client.config.parentSugestoes
              });
            };
            if (i.values[0] == '❓ Dúvidas') {
              c.edit({
                parent: client.config.parentDuvidas
              });
            };
            if (i.values[0] == '🥇 Assinaturas') {
              c.edit({
                parent: client.config.parentAssinaturas
              });
            };
          };
        });
      });
    };

    if (interaction.customId == "close-ticket") {
      const guild = client.guilds.cache.get(interaction.guildId);
      const chan = guild.channels.cache.get(interaction.channelId);

      const row = new client.discord.MessageActionRow()
        .addComponents(
          new client.discord.MessageButton()
          .setCustomId('confirm-close')
          .setLabel('Confirmar')
          .setStyle('DANGER'),
          new client.discord.MessageButton()
          .setCustomId('no')
          .setLabel('Cancelar')
          .setStyle('SECONDARY'),
        );

      const verif = await interaction.reply({
        content: '> **Tem certeza de que deseja fechar o ticket?**',
        components: [row]
      });

      const collector = interaction.channel.createMessageComponentCollector({
        componentType: 'BUTTON',
        time: 10000
      });

      collector.on('collect', i => {
        if (i.customId == 'confirm-close') {
          interaction.editReply({
            content: `> **O ticket foi fechado por** <@!${interaction.user.id}>`,
            components: []
          });

          chan.edit({
              permissionOverwrites: [
                {
                  id: client.users.cache.get(chan.topic),
                  deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
                {
                  id: client.config.roleSupport,
                  allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
                {
                  id: interaction.guild.roles.everyone,
                  deny: ['VIEW_CHANNEL'],
                },
              ],
            })
            .then(async () => {
              const embed = new client.discord.MessageEmbed()
                .setColor('ff9600')
                .setAuthor('Push Ticket', client.user.avatarURL())
                .setDescription('```Deletar canal?```');

              const row = new client.discord.MessageActionRow()
                .addComponents(
                  new client.discord.MessageButton()
                  .setCustomId('delete-ticket')
                  .setLabel('Sim')
                  .setEmoji('✅')
                  .setStyle('SUCCESS'),
                );

              chan.send({
                embeds: [embed],
                components: [row]
              });
            });

          collector.stop();
        };
        if (i.customId == 'no') {
          interaction.editReply({
            content: 'Finalizar ticket cancelado!',
            components: []
          });
          collector.stop();
        };
      });

      collector.on('end', (i) => {
        if (i.size < 1) {
          interaction.editReply({
            content: 'Finalizar ticket cancelado!',
            components: []
          });
        };
      });
    };

    if (interaction.customId == "delete-ticket") {
      const guild = client.guilds.cache.get(interaction.guildId);
      const chan = guild.channels.cache.get(interaction.channelId);

      interaction.reply({
        content: 'Finalizando ticket...'
      });

      chan.messages.fetch().then(async (messages) => {
        let a = messages.filter(m => m.author.bot !== true).map(m =>
          `${new Date(m.createdTimestamp).toLocaleString('de-DE')} - ${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
        ).reverse().join('\n');
        if (a.length < 1) a = "Não estava escrito no ticket"
        hastebin.createPaste(a, {
            contentType: 'text/plain',
            server: 'https://www.toptal.com/developers/hastebin/documents'
          }, {})
          .then(function (urlToPaste) {
            const embed = new client.discord.MessageEmbed()
              .setAuthor('Push Ticket', client.user.avatarURL())
              .setThumbnail(client.user.avatarURL())
              .setTitle('✅ Ticket Finalizado com Sucesso')
              .setDescription(`**Ticket ID:** \`${chan.id}\`. \n **Criado por** <@!${chan.topic}>. \n **Finalizado por** <@!${interaction.user.id}>\n\nTranscript : [**Transcript Log**](${urlToPaste})`)
              .setColor('2f3136')
              .setTimestamp();

            const embed2 = new client.discord.MessageEmbed()
              .setAuthor('Push Ticket', client.user.avatarURL())
              .setThumbnail(client.user.avatarURL())
              .setTitle('✅ Ticket Finalizado com Sucesso')
              .setDescription(`**Ticket ID:** \`${chan.id}\`. \n **Criado por** <@!${chan.topic}>. \n **Finalizado por** <@!${interaction.user.id}>\n\nTranscript : [**Transcript Log**](${urlToPaste})`)
              .setColor('2f3136')
              .setTimestamp();

            client.channels.cache.get(client.config.logsTicket).send({
              embeds: [embed]
            });
            client.users.cache.get(chan.topic).send({
              embeds: [embed2]
            }).catch(() => {console.log('I cant send it DM')});

            setTimeout(() => {
              chan.delete();
            }, 3000);
          });
      });
    };
  },
};

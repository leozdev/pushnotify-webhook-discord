module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (interaction.customId == "open-ticket") {


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
            allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES'],
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
          .setColor('000000')
          .setAuthor('Push Ticket')
          .setThumbnail(client.user.avatarURL())
          .setTitle('Selecione o motivo do suporte:')
          .setDescription('Após selecionar o motivo, aguarde um pouco para que nossa equipe venha te responder!')

        const row = new client.discord.MessageActionRow()
          .addComponents(
            new client.discord.MessageSelectMenu()
            .setCustomId('category')
            .setPlaceholder('Selecione o motivo:')
            .addOptions([
              {
                label: '🙋 Suporte',
                value: '🙋 Suporte'
                
              },
              {
                label: '💡 Sugestões',
                value: '💡 Sugestões'
                
              },
              {
                label: '❓ Dúvidas',
                value: '❓ Dúvidas'
               
              },
              {
                label: '💰  Planos PushNotify',
                value: '💰  Planos PushNotify'
                
              },
              {
                label: '🐌 Bug\'s',
                value: '🐌 Bug\'s'
                
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
                  .setColor('000000')
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
                  const embed3 = new client.discord.MessageEmbed()
                  .setAuthor('Push Ticket', client.user.avatarURL())
                  .setTitle('📩 Um ticket foi aberto!')
                  .setThumbnail(client.user.avatarURL())
                  .setDescription(`\n\n**\- Ticket ID:** \`${c.id}\`\n **\- Autor:** <@!${c.topic}> \n **\- Categoria:** \n\`\`\` ${i.values[0]}\`\`\` `)
                  .setColor('#2f3136')
                  .setFooter('Horário:')
                  .setTimestamp();
                  const linkRow = new client.discord.MessageActionRow()
                  .addComponents(
                  new client.discord.MessageButton()
                  .setURL(`https://discord.com/channels/1002003714405580850/${c.id}`)
                  .setLabel('Ver Ticket')
                  .setEmoji('👀')
                  .setStyle('LINK'),
                  );
                  
                  client.channels.cache.get(client.config.logsTicket).send({
                      embeds: [embed3],
                      components: [linkRow]
                    });

                  // Notificação de Ticket Opcional

                  client.users.cache.get('707711307742314567').send({embeds: [embed3], components: [linkRow]});

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
            if (i.values[0] == '💰  Planos Push Notify') {
              c.edit({
                parent: client.config.parentAssinaturas
              });
            };
            if (i.values[0] == '🐌 Bug\'s') {
              c.edit({
                  parent: client.config.parentBugs
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
          .setLabel('Sim')
          .setEmoji('✅')
          .setStyle('SUCCESS'),
          new client.discord.MessageButton()
          .setCustomId('no')
          .setLabel('Não')
          .setEmoji('899745362137477181')
          .setStyle('DANGER'),
        );

      const verif = await interaction.reply({
        content: '> **Finalizar o Ticket?**',
        components: [row]
      });

      const collector = interaction.channel.createMessageComponentCollector({
        componentType: 'BUTTON',
        time: 10000
      });

      collector.on('collect', i => {
        if (i.customId == 'confirm-close') {
          interaction.editReply({
            content: `Ticket sendo finalizado...`,
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
        };
        if (i.customId == 'no') {
          interaction.editReply({
            content: 'Ticket não foi finalizado!',
            components: []
          });
          collector.stop();
        };
      });

      collector.on('end', (i) => {
        if (i.size < 1) {
          interaction.editReply({
            content: 'Ticket não foi finalizado!',
            components: []
          });
        };
      });
    };


    if (interaction.customId == "confirm-close") {
      const guild = client.guilds.cache.get(interaction.guildId);
      const chan = guild.channels.cache.get(interaction.channelId);
      const embed = new client.discord.MessageEmbed()
      .setAuthor('Push Ticket', client.user.avatarURL())
      .setThumbnail(client.user.avatarURL())
      .setTitle('✅ Ticket Finalizado com Sucesso')
      .setDescription(`**\-Ticket ID:** \`${chan.id}\` \n **\- Autor:** <@!${chan.topic}> \n **\- Finalizado por:** <@!${interaction.user.id}>`)
      .setColor('2f3136')
      .setFooter('Horário:')
      .setTimestamp()

      chan.send({
        embeds: [embed]
      })

    chan.messages.fetch().then(async (messages) => {
      const embed = new client.discord.MessageEmbed()
      .setAuthor('Push Ticket', client.user.avatarURL())
      .setThumbnail(client.user.avatarURL())
      .setTitle('✅ Ticket Finalizado com Sucesso')
      .setDescription(`**\- Ticket ID:** \`${chan.id}\`\n **\- Autor:** <@!${chan.topic}>  \n **\- Finalizado por:** <@!${interaction.user.id}>`)
      .setColor('2f3136')
      .setFooter('Horário:')
      .setTimestamp();


      client.channels.cache.get(client.config.logsTicket).send({
      embeds: [embed]
      });
      setTimeout(() => {
      chan.delete();
      }, 3000);
      });
    };
  },
};


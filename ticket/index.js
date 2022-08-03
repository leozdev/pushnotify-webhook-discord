const fs = require('fs');
const {
  Client,
  Collection,
  Intents
} = require('discord.js');
const config = require('./config.json');
const {
  REST
} = require('@discordjs/rest');
const {
  Routes
} = require('discord-api-types/v9');
const {
  clientId
} = require('./config.json');
const t = require('./token.json');

const slashcommands = [];
const slashcommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of slashcommandFiles) {
  const command = require(`./commands/${file}`);
  slashcommands.push(command.data.toJSON());
}

const rest = new REST({
  version: '9'
}).setToken(t.token);

rest.put(Routes.applicationCommands(clientId), {
    body: slashcommands
  })
  .then(() => console.log('✅ Comandos de aplicativos registrados com sucesso.'))
  .catch(console.error);

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]
});

const Discord = require('discord.js');
client.discord = Discord;
client.config = config;

client.on('message', message => {
  if (message.content === '!finalizar2') {  
    if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply({ content: "Você não tem permissão!"})
     message.channel.delete()

     const finalizar2 = new client.discord.MessageEmbed()
      .setAuthor('Push Ticket', client.user.avatarURL())
      .setThumbnail(client.user.avatarURL())
      .setTitle('⚠️ Ticket foi fechado a força!')
      .setDescription('\`\`\`Sem informações do Ticket Fechado\`\`\`')
      .setColor('2f3136')
      .setFooter('Horário:')
      .setTimestamp();


      client.channels.cache.get(client.config.logsTicket).send({
      embeds: [finalizar2]
      });
  }
});
// TESTE MEMBROS DO CARGO TICKET
client.on("message", message => {

  if(message.content == `!ticketmembros`) {
      const MessageEmbed2 = new client.discord.MessageEmbed()
          .setTitle(`ID\'s com cargo de 🎫┃Ticket`)
          .setDescription(message.guild.roles.cache.get('1002781224693158018').members.map(m=>m.user.id).join('\n'));

          client.channels.cache.get(client.config.logsTicket).send({
            embeds: [MessageEmbed2]
            });                    
  }
});
// Verificar Bot se está respondendo
client.on('message', message => {
  if (message.content === '!ticket') {   
    if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply({ content: "Você não tem permissão!"})
     message.reply({
      content: '<:moderador:1002317654213799958> Push Ticket v2.0.0 está funcionando perfeitamente!',
      ephemeral: true,
    });
  }
});


client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
};

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(...args, client));
};

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;


  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client, config);
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: '❌ Ocorreu um erro ao executar este comando!',
      ephemeral: true
    });
  };
});

client.login(require('./token.json').token);
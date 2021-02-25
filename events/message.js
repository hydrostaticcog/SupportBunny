Logger = require('../modules/logger');
logger = new Logger('main');
const Discord = require('discord.js')
const client = new Discord.Client()
const db = require('quick.db')
const config = require('../config.json')
const { MessageEmbed } = require('discord.js')

module.exports = async (client, message) => {
    // Ignore all bots
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return message.channel.send('I don\'t support DMs due to Discord\'s limitations!')

    // Ignore messages not starting with the prefix
    const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
    let pref = db.get(`prefix.${message.guild.id}`);

    let prefix;

    if (!pref) {
        prefix = message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : config.prefix; // If the server doesn't have any custom prefix, return default.
    } else {
        prefix = message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : pref;
    }

    const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);

    if(!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);

    if (message.content === `<@!${client.user.id}>`) {
        const embed = new MessageEmbed()
            .setTitle(client.user.username)
            .setDescription(`Hi! I'm ${client.user.username}, and I handle support tickets here!`)
            .addField('Prefix', prefix)
            .setFooter(`The prefix can be changed with ${prefix}prefix <new prefix>. It can be set to the default with ${prefix}prefix default`)
            .setTimestamp()
        message.channel.send(embed)
    }
  
    // Our standard argument/command name definition.
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
    // Grab the command data from the client.commands Enmap
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

    logger.info(`Command ${db.get(`prefix.${message.guild.id}`)}${command} requested by ${message.author.tag}`)
    // If that command doesn't exist, silently exit and do nothing
    if (!cmd) return
  
    // Run the command
    cmd.run(client, message, args);
  };
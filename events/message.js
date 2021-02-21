Logger = require('../modules/logger');
logger = new Logger('main');
const Discord = require('discord.js')
const client = new Discord.Client()
const db = require('quick.db')

module.exports = (client, message) => {
    // Ignore all bots
    if (message.author.bot) return;

    // Ignore messages not starting with the prefix (in config.json)
    if (message.content.indexOf(db.get(`prefix.${message.guild.id}`)) !== 0) return;
  
    // Our standard argument/command name definition.
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
    // Grab the command data from the client.commands Enmap
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

    logger.info(`Command ${db.get(`prefix.${message.guild.id}`)}${command} requested by ${message.author.tag}`)
    // If that command doesn't exist, silently exit and do nothing
    if (!cmd) return logger.error(`Command ${db.get(`prefix.${message.guild.id}`)}${command} not found`);
  
    // Run the command
    cmd.execute(message, args);
  };
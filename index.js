const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");

const client = new Discord.Client();
const config = require("./config.json");
client.config = config;
Logger = require('./modules/logger');
client.logger = new Logger('main');
client.commands = new Enmap();
client.aliases = new Enmap();
const db = require('quick.db')

db.set(`on`, 'true')

fs.readdir("./events/", (err, files) => {
  client.logger.info(`Attempting to load events`);
  if (err) return client.logger.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
  client.logger.info(`Successfully loaded events!`);
});

fs.readdir("./commands/", (err, files) => {
  client.logger.info(`Attempting to load commands`);
  if (err) return client.logger.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    client.commands.set(commandName, props);
  });
  client.logger.info(`Successfully loaded commands!`);
});

client.login(config.token);
 
Logger = require('../modules/logger');
logger = new Logger('main');
const Discord = require('discord.js')
const client = new Discord.Client()
const db = require('quick.db')

module.exports = (client, message) => {
    db.set(`prefix.${message.guild.id}`, '.')
}
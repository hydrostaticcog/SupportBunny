Logger = require('../modules/logger');
logger = new Logger('main');
const db = require('quick.db')
module.exports ={
    name: "ticket",
    description: "creates/handles tickets",
    args: true,
    execute(message, args){
        if (args[0] == 'create') {
            var supportRole = message.guild.roles.cache.find(role => role.name === "Support");
            var everyone = message.guild.roles.cache.find(role => role.name === "@everyone");
            var botID = message.guild.roles.cache.find(role => role.name === "TicketBunny");
            var ticketNum = db.get(`ticketNum.${message.guild.id}`)
            var channel1 = message.guild.channels.create(`ticket-${ticketNum}`, {
                type: "text",
                permissionOverwrites: [
                    {
                        id: message.author.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: supportRole,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: botID,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: everyone,
                        deny: ['VIEW_CHANNEL']
                    }
                ]
            })
            var channelID = message.guild.channels.cache.find(channel => channel.name === `ticket-${ticketNum}`) // This is where the problems are
            db.set(`ticket.${message.guild.id}.${message.author.id}`, channelID)
            var newNum = ticketNum + 1
            db.set(`ticketNum.${message.guild.id}`, newNum)
        } if (args[0] == 'init') {
            db.set(`ticketNum.${message.guild.id}`, 1)
            message.channel.send('Ticket Number System Initiated!')
        } if (args[0] == 'reset') {
            db.set(`ticketNum.${message.guild.id}`, 1)
            message.channel.send('Ticket Numbers Reset!')
        } if (args[0] == 'resolve', args[0] == 'delete') {
            var channel = db.get(`ticket.${message.guild.id}.${message.author.id}`)
            channel.delete(channel)
        }
    }
}
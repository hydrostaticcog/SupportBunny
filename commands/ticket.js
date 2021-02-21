Logger = require('../modules/logger');
logger = new Logger('main');
const db = require('quick.db')
module.exports ={
    name: "ticket",
    description: "creates/handles tickets",
    args: true,
    execute(message, args){
        if (args[0] == 'create') {
            var hasTicket = db.get(`ticket.${message.guild.id}.${message.author.id}`)
            if (hasTicket == 0) {
                var supportRole = message.guild.roles.cache.find(role => role.name === "Support");
                var everyone = message.guild.roles.cache.find(role => role.name === "@everyone");
                var botID = message.guild.roles.cache.find(role => role.name === "TicketBunny");
                var ticketNum = db.get(`ticketNum.${message.guild.id}`)
                let category = message.guild.channels.cache.find(cat=> cat.name === 'Support')
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
                    ],
                    parent: category.id
                })
                var channel = message.guild.channels.cache.find(channel => channel.name === `ticket-${ticketNum}`)
                var newNum = ticketNum + 1
                db.set(`ticketNum.${message.guild.id}`, newNum)
                db.set(`ticket.${message.guild.id}.${message.author.id}`, ticketNum)
                message.channel.send(`Support Ticket #${ticketNum} created in #ticket-${ticketNum}`)
            } else {
                message.channel.send(`Your ticket #${hasTicket} is still in progress! Close that one to open a new ticket!`)
            }
        } if (args[0] == 'init') {
            if (message.member.roles.cache.find(r => r.name === "Admin")) {
                db.set(`ticketNum.${message.guild.id}`, 1)
                message.channel.send('Ticket Number System Initiated!')
            } else {
                message.channel.send('You dont have perms for that!')
            }
        } if (args[0] == 'reset') {
            if (message.member.roles.cache.find(r => r.name === "Admin")) {
                db.set(`ticketNum.${message.guild.id}`, 1)
                message.channel.send('Ticket Numbers Reset!')
            } else {
                message.channel.send('You dont have perms for that!')
            }
        } if (args[0] == 'resolve') {
            var ticketNum = db.get(`ticket.${message.guild.id}.${message.author.id}`)
            var channel = message.guild.channels.cache.find(channel => channel.name === `ticket-${ticketNum}`)
            channel.delete();
            message.channel.send(`Support Ticket Resolved`)
            db.set(`ticket.${message.guild.id}.${message.author.id}`, 0)
        } if (args[0] == 'forceclose') {
            if (message.member.roles.cache.find(r => r.name === "Admin")) {
                db.set(`ticket.${message.guild.id}.${args[1]}`, 0)
                message.channel.send('Tickets Force Closed')
            } else {
                message.channel.send('You dont have perms for that!')
            }
        }
    }
}


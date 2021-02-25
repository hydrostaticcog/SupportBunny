Logger = require('../modules/logger');
logger = new Logger('main');
const db = require('quick.db')
const Discord = require('discord.js')
module.exports ={
    info: {
        name: "ticket",
        description: "creates/handles tickets",
        args: true,
    },

    run: async function(client, message, args){
        var prefix = db.get(`prefix.${message.guild.id}`)
        if (!args[0]) return message.channel.send(`What would you like to do with the ticket (open, close, resolve, etc.)`)
        if (args[0] == 'startinit') {
            if (message.member.hasPermission('ADMINISTATOR')) {
                db.set(`ticketNum.${message.guild.id}`, 1)
                db.set(`ticketSettings.${message.guild.id}.category`, args[1])
                db.set(`ticketSettings.${message.guild.id}.supportRole`, args[2])
                db.set(`ticketSettings.${message.guild.id}.isInit`, 1)
                message.channel.send('Ticket Number System Initiated!')
            } else {
                message.channel.send('You dont have perms for that!')
            }
            return
        } if (args[0] == 'init') {
            if (message.member.hasPermission('ADMINISTATOR')) {
                const questions = [
                    'What is the name of your support role (EXACT NAME)?'
                ]
                const dbID = [
                    'supportRole'
                ]
                let counter = 0
                const filter = m => m.author.id === message.author.id
                const collector = new Discord.MessageCollector(message.channel, filter, {max: questions.length})
                message.channel.send(`Thanks for choosing SupportBunny! Please start by answering some questions.`)
                message.channel.send(questions[counter++])
                collector.on('collect', (m) => {
                    message.channel.send(questions[counter++])
                })
                collector.on('end', (collected) => {
                    let counter = 0
                    collected.forEach((value) => {
                        let countNum = counter++
                        db.set(`ticketSettings.${message.guild.id}.isInit`, 1)
                        message.channel.send(`SupportBunny Core Initiated`)
                        return
                    })
                })
            } else {
                message.channel.send('You dont have perms for that!')
            }
            return
        }
        if (db.get(`ticketSettings.${message.guild.id}.isInit`) == 0) {message.channel.send(`Please ask your server admins to initialize the support system with \`${prefix}ticket init\``); return}
        if (db.get(`ticketSettings.${message.guild.id}.isInit`) == undefined) {message.channel.send(`Please ask your server admins to initialize the support system with \`${prefix}ticket init\``); return}
        
        if (args[0] == 'create' || args[0] == 'open') {
            var hasTicket = db.get(`ticket.${message.guild.id}.${message.author.id}`)
            if (hasTicket == 0) {
                var supportCat = db.get(`ticketSettings.${message.guild.id}.category`)
                var supportRoleName = db.get(`ticketSettings.${message.guild.id}.supportRole`)
                var supportRole = message.guild.roles.cache.find(role => role.name === supportRoleName);
                var everyone = message.guild.roles.cache.find(role => role.name === "@everyone");
                var botID = message.guild.roles.cache.find(role => role.name === client.user.username);
                var ticketNum = db.get(`ticketNum.${message.guild.id}`)
                let category = message.guild.channels.cache.find(cat=> cat.name === supportCat)
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
                var channel = message.guild.channels.cache.find(channel => channel.name === `ticket-${ticketNum}`)
                var newNum = ticketNum + 1
                db.set(`ticketNum.${message.guild.id}`, newNum)
                db.set(`ticket.${message.guild.id}.${message.author.id}`, ticketNum)
                message.channel.send(`Support Ticket #${ticketNum} created in #ticket-${ticketNum}`)
            } else {
                message.channel.send(`Your ticket #${hasTicket} is still in progress! Close that one to open a new ticket!`)
            }
        } if (args[0] == 'reset') {
            if (message.member.hasPermission('ADMINISTATOR')) {
                db.set(`ticketNum.${message.guild.id}`, 1)
                message.channel.send('SupportBunny Core Reset!')
            } else {
                message.channel.send('You dont have perms for that!')
            }
        } if (args[0] == 'resolve' || args[0] == 'close') {
            var ticketNum = db.get(`ticket.${message.guild.id}.${message.author.id}`)
            var channel = message.guild.channels.cache.find(channel => channel.name === `ticket-${ticketNum}`)
            channel.delete();
            message.channel.send(`Support Ticket Resolved`)
            db.set(`ticket.${message.guild.id}.${message.author.id}`, 0)
        } if (args[0] == 'forceclose') {
            if (message.member.hasPermission('ADMINISTATOR')) {
                db.set(`ticket.${message.guild.id}.${args[1]}`, 0)
                message.channel.send('Tickets Force Closed')
            } else {
                message.channel.send('You dont have perms for that!')
            }
        }
        if (args[0] == 'deinit') {
            if (message.member.hasPermission('ADMINISTATOR')) {
                db.set(`ticketSettings.${message.guild.id}.isInit`, 0)
                message.channel.send('SupportBunny Core Deinitialized!')
            } else {
                message.channel.send('You dont have perms for that!')
            }
        }
    }
}


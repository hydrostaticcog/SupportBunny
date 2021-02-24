const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: "help",
    description: "Show a List of All Commands",
    usage: "[command]",
    aliases: ["h"],
    category: 'Information',
    execute(client, message, args){
        try {
            let pref = db.get(`prefix.${message.guild.id}`);

            let prefix;

            if (!pref) {
                prefix = client.config.prefix; // If the server doesn't have any custom prefix, return default.
            } else {
                prefix = pref;
            }

            let pages = [`Thanks for inviting ${client.user.username} to your server! This is ${client.user.username}'s help menu/command list. For help per command (aliases, usage, description, etc.), do ${client.config.prefix}help [command]. Turn the page to see the commands...

            React With ◀️ to go Back a Page
            React With ▶️ to go Forward a Page

            
            **Help Pages**
**Page 1:** :paper: Help Menu
**Page 2:** :ticket: Ticket Commands
**Page 3:** :busts_in_silhouette: Admin Commands
**Page 4:** Credits
            `, `
            :ticket: **Ticket Help**
            \`${prefix}ticket open/create\` - Open a Ticket
            \`${prefix}ticket resolve\` - Close a support ticket
            `, `
            :busts_in_silhouette: **Admin Help**
            \`${prefix}ticket init\` - Initializes Ticket System
            \`${prefix}prefix <your prefix>\` - Change the Server-Wide Prefix
            `, `
            **Credits:**
            hydrostaticcog - Lead Dev/did most of the programming
            kai2342340gamer - Contributed advice/support server
            `]

            let page = 1

            let embed = new MessageEmbed()
                .setAuthor(client.user.username)
                .setColor("BLUE")
                .setDescription(pages[page-1])
                .setFooter(`Page ${page} of ${pages.length}`)
                .setTimestamp()

            message.channel.send('Help has been sent to your DMs and below :point_down:')
            if(!args[0]) message.channel.send(embed).then(msg => {
                msg.react('◀️').then(r => {
                    msg.react('▶️')

                    const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀️' && user.id === message.author.id
                    const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶️' && user.id === message.author.id

                    const backwards = msg.createReactionCollector(backwardsFilter, { time: 5000000 })
                    const forwards = msg.createReactionCollector(forwardsFilter, { time: 5000000 })

                    backwards.on('collect', r => {
                        if (page === 1) return
                        page--
                        embed.setDescription(pages[page-1])
                        embed.setFooter(`Page ${page} of ${pages.length}`)
                        msg.edit(embed)
                    })

                    forwards.on('collect', r => {
                        if (page === pages.length) return
                        page++
                        embed.setDescription(pages[page-1])
                        embed.setFooter(`Page ${page} of ${pages.length}`)
                        msg.edit(embed)
                    })
                })
            })
            if(!args[0])return message.author.send(embed).then(msg => {
                msg.react('◀️').then(r => {
                    msg.react('▶️')

                    const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀️' && user.id === message.author.id
                    const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶️' && user.id === message.author.id

                    const backwards = msg.createReactionCollector(backwardsFilter, { time: 5000000 })
                    const forwards = msg.createReactionCollector(forwardsFilter, { time: 5000000 })

                    backwards.on('collect', r => {
                        if (page === 1) return
                        page--
                        embed.setDescription(pages[page-1])
                        embed.setFooter(`Page ${page} of ${pages.length}`)
                        msg.edit(embed)
                    })

                    forwards.on('collect', r => {
                        if (page === pages.length) return
                        page++
                        embed.setDescription(pages[page-1])
                        embed.setFooter(`Page ${page} of ${pages.length}`)
                        msg.edit(embed)
                    })
                })
            })
            else {
                let cmd = args[0]
                let command = client.commands.get(cmd)
                if(!command)command = client.commands.find(x => x.info.aliases.includes(cmd))
                if(!command)return message.channel.send("Unknown Command")
                let commandinfo = new MessageEmbed()
                    .setTitle(`${client.config.prefix}`+command.info.name+" Command Information")
                    .setColor("YELLOW")
                    .setDescription(`
    Description: ${command.info.description}
    Usage: \`\`${prefix}${command.info.name} ${command.info.usage}\`\`
    Aliases: ${command.info.aliases.join(", ")}
    `)
                message.author.send(commandinfo)
            }
        } catch (err) {
            const channel1 = client.channels.cache.find(channel => channel.id === '803711476635533322')
            const error = new MessageEmbed()
                .setTitle('Error')
                .setColor('RED')
                .addFields(
                    {
                        name: 'Guild Details',
                        value: `ID: \`${message.guild.id}\`
                            Name: \`${message.guild.name}\``,
                        inline: false
                    },
                    {
                        name: 'Channel Details',
                        value: `ID: \`${message.channel.id}\`
                            Name: \`${message.channel.name}\``,
                        inline: false
                    },
                    {
                        name: 'Author Details',
                        value: `ID: \`${message.author.id}\`
                            Name: \`${message.author.tag}\``,
                        inline: false
                    },
                    {
                        name: 'Command Message Details',
                        value: `ID: \`${message.id}\``,
                        inline: false
                    },
                    {
                        name: 'Error',
                        value: `\`\`\`${err}\`\`\``,
                        inline: false
                    })
        }
    }
}

Logger = require('../modules/logger');
logger = new Logger('main');
const db = require('quick.db')
module.exports ={
    name: "prefix",
    description: "sets prefix",
    args: true,
    execute(client, message, args){
        if (!args[0]) return message.channel.send('Please specify a new prefix')
        if (message.member.hasPermission('ADMINISTATOR')) {
            if (args[0] == 'default') {
                db.set(`prefix.${message.guild.id}`, '#')
                message.channel.send(`Prefix set to default`)
            } else {
                db.set(`prefix.${message.guild.id}`, args[0])
                message.channel.send(`Prefix set to ${args[0]}`)
            }
        } else {
            message.channel.send('You dont have perms for that!')
        }
        
    }
}

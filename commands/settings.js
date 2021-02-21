Logger = require('../modules/logger');
logger = new Logger('main');
const db = require('quick.db')
module.exports ={
    name: "settings",
    description: "bot settings",
    args: true,
    execute(message, args){
        if (args[0] == 'prefix') {
            if (message.member.roles.cache.find(r => r.name === "Admin")) {
                db.set(`prefix.${message.guild.id}`, args[1])
                message.channel.send(`Prefix set to ${args[1]}`)
            } else {
                message.channel.send('You dont have perms for that!')
            }
        }
    }
}
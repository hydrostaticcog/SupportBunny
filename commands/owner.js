Logger = require('../modules/logger');
logger = new Logger('main');
const config = require('../config.json');
db =require('quick.db')
module.exports ={
    info: {
        name: "owners",
        description: "owner stuff",
        args: true,
    },

    run: async function(client, message, args){
        if (message.author.id == config['owner-id1'] || message.author.id == config['owner-id2']) {
            if (args[0] == 'db') {
                if (args[1] == 'set') {
                    db.set(args[2], args[3])
                    message.channel.send(`DB entry ${args[2]} set to ${args[3]}`)
                }
            }
        }

    }
}

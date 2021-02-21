Logger = require('../modules/logger');
logger = new Logger('main');
module.exports ={
    name: "ping",
    description: "responds with bot latency",
    args: false,
    execute(message, args){
        message.channel.send(`Pong! Bot latency is ${Date.now() - message.createdTimestamp}ms`)
    }
}
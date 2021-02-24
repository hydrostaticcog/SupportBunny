Logger = require('../modules/logger');
logger = new Logger('main');
module.exports ={
    name: "ping",
    description: "responds with bot latency",
    args: false,
    execute(client, message, args){
        message.channel.send('Calculating ping...').then((resultMessage) => {
            const ping = resultMessage.createdTimestamp - message.createdTimestamp
  
            resultMessage.edit(`:ping_pong: Pong! **Bot Latency:** ${ping}ms, **API Latency:** ${client.ws.ping}ms`)})

    }
}

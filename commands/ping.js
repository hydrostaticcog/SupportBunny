Logger = require('../modules/logger');
logger = new Logger('main');
module.exports ={
    info: {
        name: "ping",
        description: "returns server ping",
        args: false,
    },

    run: async function(client, message, args){
        message.channel.send('Calculating ping...').then((resultMessage) => {
            const ping = resultMessage.createdTimestamp - message.createdTimestamp
  
            resultMessage.edit(`:ping_pong: Pong! **Bot Latency:** ${ping}ms, **API Latency:** ${client.ws.ping}ms`)})

    }
}

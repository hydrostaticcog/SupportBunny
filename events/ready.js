Logger = require('../modules/logger');
logger = new Logger('main');
const config = require("../config.json")
const Discord = require('discord.js')

module.exports = async (client) => {
  console.log(`[API] Logged in as ${client.user.username}. Guild Count: ${client.guilds.cache.size}`);

  const arrayOfStatus = [
    `${client.guilds.cache.size} Servers`,
    `${client.channels.cache.size} Channels`,
    `${client.users.cache.size} Users`,
    `${client.config.prefix}help | ${client.config.prefix}invite`
  ];

  let index = 0;
  setInterval(() => {
    if(index === arrayOfStatus.length) index = 0;
    const status = arrayOfStatus[index];
    client.user.setActivity(status, {
      type: "WATCHING",
    });
    index++;
  }, 20000)

  const channelID = client.channels.cache.find(ch => ch.id === '812868880086597712')
  let time = Date.now();
  await client.api.channels('812868880086597712').typing.post()
  let ping = Date.now() - time;
  let guildCount = client.guilds.cache.size
  let userCount = client.users.cache.size
  let channelCount = client.channels.cache.size
  let cmdCount = client.commands.size
  let totalSeconds = (client.uptime / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let uptime = `${hours} hours`
  setInterval(function(){
    const embed = new Discord.MessageEmbed()
        .setTitle(`${client.user.username}'s Status`)
        .setColor('ORANGE')
        .addField('Guild Count', guildCount, true)
        .addField('User Count', userCount, true)
        .addField('Channel Count', channelCount, true)
        .addField('Message Count', '1000', true)
        .addField('Ping', `${ping}ms`, true)
        .addField('API Latency', `${client.ws.ping}ms`, true)
        .addField('Commands Loaded', cmdCount, true)
        .addField(`Uptime`, uptime, true)
        .addField(`Library`, 'JavaScript (JS)', true)
        .setFooter(`This message should update every 30 seconds. Last Update`)
        .setTimestamp()
    channelID.send(embed).then(m => {
      m.delete({timeout: 29990})
    })
  }, 30000);
};
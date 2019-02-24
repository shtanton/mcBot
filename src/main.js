const Discord = require('discord.io');
const {token} = require('../auth.json');
const fs = require('fs');
const path = require('path');

const bot = new Discord.Client({
  token,
  autorun: true,
});

bot.on('message', (user, userId, channelId, message, event) => {
  if (message === 'yeet') {
    bot.sendMessage({
      to: channelId,
      message: 'YEEEEEEEEEEEET',
    });
    const channels = Object.values(bot.channels).filter(channel => {
      return channel.members[userId];
    });
    if (channels.length < 1) {
      bot.sendMessage({
        to: channelId,
        message: "I couldn't find ur channel bruh",
      });
      return;
    }
    const targetChannel = channels[0].id;
    console.log('Joining ' + targetChannel);
    console.log(__dirname);
    bot.joinVoiceChannel(targetChannel, err => {
      if (err) return console.log(err);
      bot.getAudioContext(targetChannel, (err, stream) => {
        if (err) return console.log(err);

        fs.createReadStream(path.resolve(__dirname, '../music.mp3')).pipe(
          stream,
          {end: false},
        );

        stream.on('done', () => {
          console.log('Done');
        });
      });
    });
  }
});

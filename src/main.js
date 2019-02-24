const Discord = require('discord.io');
const {token} = require('../auth.json');
const fs = require('fs');
const path = require('path');

const bot = new Discord.Client({
  token,
  autorun: true,
});

const mcPrisonId = '489881273649594368';
const serverId = '364843750620397568';

const getUserChannel = userId => {
  const channels = Object.values(bot.channels).filter(channel => {
    return channel.members[userId];
  });
  if (channels.length < 1) {
    bot.sendMessage({
      to: channelId,
      message: "I couldn't find ur channel bruh",
    });
    return null;
  }
  return channels[0];
};

bot.on('message', (user, userId, channelId, message, event) => {
  if (message === 'yeet') {
    bot.sendMessage({
      to: channelId,
      message: 'YEEEEEEEEEEEET',
    });

    const targetChannel = getUserChannel(userId);
    if (targetChannel === null) return;

    console.log('Joining ' + targetChannel.id);
    console.log(__dirname);
    bot.joinVoiceChannel(targetChannel.id, err => {
      if (err) return console.log(err);
      bot.getAudioContext(targetChannel.id, (err, stream) => {
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
  } else if (message.substr(0, 6) === 'begone') {
    const targetId = message.substr(7);
    const targetUser = bot.users[targetId];
    bot.moveUserTo({
      serverID: serverId,
      userID: targetId,
      channelID: mcPrisonId,
    });
  } else if (message === '!users') {
    const targetChannel = getUserChannel(userId);
    if (targetChannel === null) return;

    const members = targetChannel.members;
    Object.values(members).forEach(({user_id: id}) => {
      const user = bot.users[id];
      bot.sendMessage({
        to: channelId,
        message: user.username + ': ' + id,
      });
    });
  }
});

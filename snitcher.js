const { Client } = require("discord.js-selfbot-v13");
const dotenv = require('dotenv');
const express = require("express");
const app = express();

dotenv.config();

app.listen(3000, () => {
  console.log("Project is running");
});

const client = new Client();

const serverId = '686526398285742087'; 

const channelMap = {
  '687061265897619515': '1388277540518367434',
  '688825257376612471': '1388277503952556032',
};

client.on('ready', () => {
  console.log(`Bot is online! Logged in as ${client.user.tag}`);
  client.user.setPresence({ status: 'invisible' });
});

client.on('messageCreate', async (message) => {
  if (!message.guild || message.guild.id !== serverId) return;

  const destChannelId = channelMap[message.channel.id];
  if (!destChannelId) return;

  try {
    const content = message.content.trim();
    if (!content) return;

    let replyMessage = null;
    if (message.reference) {
      try {
        replyMessage = await message.channel.messages.fetch(message.reference.messageId);
      } catch (fetchError) {
        // If we can't fetch the reply message, just continue without it
        console.log("Could not fetch reply message:", fetchError.message);
      }
    }

    let formatted = `${message.author.username} said:\n${content}`;

    if (replyMessage) {
      formatted += `\n\n↪ In reply to ${replyMessage.author.username}:\n${replyMessage.content}`;
    }

    formatted += `\n—`; 

    const destinationChannel = await client.channels.fetch(destChannelId);
    destinationChannel.send(formatted);
  } catch (err) {
    console.error("Failed to forward message:", err);
  }
});

client.login(process.env.TOKEN)
  .then(() => console.log("Logged in successfully!"));

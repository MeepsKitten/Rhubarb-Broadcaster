global.Discord = require('discord.js')
global.commands = require('./commands.js')
global.config = require('./config.json')
const DataCheck = require('./UserDataCheck.js')
global.fs = require('fs')
global.client = new Discord.Client()
global.UsrData = new Map()


const ServerConnection = require('./UserInfo.js')

client.on('ready', () => {
    console.log('Ready!')
    client.user.setPresence({ activity: { name: '- bot by Cameron Bess', type: 'WATCHING' }, status: 'online' }
    )
})

client.login('[redacted]')

client.on('message', async message => {
  if (message.author.bot) return
  commands.CommandCheck(message)
})

global.SaveConfigToFile = function () {
  const data = JSON.stringify(config)
  fs.writeFileSync('config.json', data)
}

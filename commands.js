const DataCheck = require('./UserDataCheck.js')

const options = {
  includeScore: false
}

exports.CommandCheck = function (message) {
  const match = message.content.match(/^!([a-zA-Z0-9-]+) *.*$/)

  let CurrentUsrData = UsrData.get(message.author.id)

  CurrentUsrData = DataCheck.ServerDataCheck(CurrentUsrData, message.author.id)

  if (match) {
    const [, command] = match
    ExecuteCorrectCommand(command, message, CurrentUsrData)
  }

  //the message isnt a command so ready it for brodcasting
  else if(CurrentUsrData.broadcastChannel == message.channel.id)
  {
    CurrentUsrData.QueuedMessage = message.content
    CurrentUsrData.QueuedAttachments = message.attachments.first()
    console.log()

    CurrentUsrData.WaitingOnConfirm = true
    message.channel.send('Message ready to broadcast. Please type !confirm to send it. Otherwise, type a new message.')
  }


}

function ExecuteCorrectCommand(command, message, CurrentUsrData) {
  if (message.member.hasPermission('ADMINISTRATOR')) {
  console.log(`!${command} run on ${message.guild.name}`)
    switch (command) {
      case 'addlistener':
        setlistenerHandle(CurrentUsrData, message)
        break

      case 'disconnectlistener':
        disconnectlistenerHandle(CurrentUsrData, message)
        break

      case 'setbroadcaster':
        setbroadcasterHandle(CurrentUsrData, message)
        break

      case 'setpreviewer':
        setpreviewerHandle(CurrentUsrData, message)
        break

      case 'preview':
        previewHandle(CurrentUsrData, message)
        break

      case 'confirm':
        confirmHandle(CurrentUsrData, message)
        break

      case 'listeners':
        listenersHandle(CurrentUsrData, message)
      break
    }
  }
}

async function setlistenerHandle (CurrentUsrData, message) {
  CurrentUsrData.ListenerChannels.push(message.channel.id)
  config[message.author.id].ListenerChannels = CurrentUsrData.ListenerChannels
  SaveConfigToFile()
  message.channel.send(`This channel will now recieve tasty wisdom from ${message.author.username} on occasion`)
}

async function listenersHandle (CurrentUsrData, message) {
  if (CurrentUsrData.ListenerChannels.length > 0) {
    let output = 'Your Listeners: '
    CurrentUsrData.ListenerChannels.forEach(function (channel) {
      output += `<#${channel}> `
    })
    message.channel.send(output)
  }
  else
    message.channel.send('You have no Listeners')
}

async function disconnectlistenerHandle (CurrentUsrData, message) {
  CurrentUsrData.ListenerChannels = CurrentUsrData.ListenerChannels.filter((n) => {return n != message.channel.id})
  config[message.author.id].ListenerChannels = CurrentUsrData.ListenerChannels
  SaveConfigToFile()

  message.channel.send("This channel will no longer recieve my tasty messages")
}

async function setbroadcasterHandle (CurrentUsrData, message) {
  CurrentUsrData.broadcastChannel = message.channel.id
  config[message.author.id].broadcastChannel = CurrentUsrData.broadcastChannel

  SaveConfigToFile()

  message.channel.send("This is now your broadcasting channel! Any message sent here will be broadcasted to any channels that are in your listener list")
}

async function setpreviewerHandle (CurrentUsrData, message) {
  CurrentUsrData.previewChannel = message.channel.id
  config[message.author.id].previewChannel = CurrentUsrData.previewChannel

  SaveConfigToFile()

  message.channel.send("This is now your preview channel! Before you confirm a broadcast you can type !preview to see what it will look like.")
}

async function previewHandle (CurrentUsrData, message) {
  if (CurrentUsrData.WaitingOnConfirm) {
    let attach = new Discord.MessageAttachment()
    attach = CurrentUsrData.QueuedAttachments
    client.channels.fetch(CurrentUsrData.previewChannel).then(channelres => channelres.send("Generating preview...")).catch((error) => {
      //if message doesnt send then remove this chanel from listenrs
      CurrentUsrData.previewChannel = undefined
      config[message.author.id].previewChannel = undefined
      message.channel.send(`preview channel no longer exists. Please set a new one`)
      SaveConfigToFile()
      return
    })
    client.channels.fetch(CurrentUsrData.previewChannel).then(channelres => channelres.send(CurrentUsrData.QueuedMessage, attach))

    message.channel.send(`Sending preview`)
  }
}

async function confirmHandle (CurrentUsrData, message) {
  if(CurrentUsrData.WaitingOnConfirm)
  {
    CurrentUsrData.ListenerChannels.forEach(function (channel) {
      let attach = new Discord.MessageAttachment()
      attach = CurrentUsrData.QueuedAttachments
      client.channels.fetch(channel).then(channelres => channelres.send(CurrentUsrData.QueuedMessage, attach)).catch((error) => {
        //if message doesnt send then remove this chanel from listenrs
        CurrentUsrData.ListenerChannels = CurrentUsrData.ListenerChannels.filter((n) => { return n != channel})
        config[message.author.id].ListenerChannels = CurrentUsrData.ListenerChannels
        message.channel.send(`Listener channel ${channel} no longer exists. Removing it from your listeners`)
        SaveConfigToFile()
      })
      message.channel.send(`Sent some tasty words to <#${channel}>`)
    }
    )
  }
}
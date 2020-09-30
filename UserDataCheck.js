const UserInfo = require('./UserInfo.js')

exports.ServerDataCheck = function (CurUserData, userId) {
  if (!CurUserData) {
    console.log(`No user data found for the user\nInitializing...`)
    let usrdat = new UserInfo()
    UsrData.set(userId, usrdat)
    CurUserData = usrdat

    // check existing config
    if (config[userId]) {
      if (config[userId].hasOwnProperty('ListenerChannels')) {
        CurUserData.ListenerChannels = config[userId].ListenerChannels
      }
      if (config[userId].hasOwnProperty('broadcastChannel')) {
        CurUserData.broadcastChannel = config[userId].broadcastChannel
      }
      if (config[userId].hasOwnProperty('previewChannel')) {
        CurUserData.previewChannel = config[userId].previewChannel
      }
    } else {
      config[userId] = {}
    }
  }
  return CurUserData
}

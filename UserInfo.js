module.exports = class UserInfo {
  constructor () {
    this.broadcastChannel = undefined
    this.previewChannel = undefined
    this.ListenerChannels = []
    this.QueuedMessage = undefined
    this.QueuedAttachments = undefined
    this.WaitingOnConfirm = false
  }
}

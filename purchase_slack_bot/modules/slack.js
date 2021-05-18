const axios = require('axios')
const config = require('../config')

const sendDM = async (userId, message) => {
  try {
    const conversationResponse = await axios.post(
      'https://slack.com/api/conversations.open',
      {
        users: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${config.botToken}`,
        },
      },
    )

    const postResponse = await axios.post(
      'https://slack.com/api/chat.postMessage',
      {
        channel: conversationResponse.data.channel.id,
        blocks: message,
      },
      {
        headers: {
          Authorization: `Bearer ${config.botToken}`,
        },
      },
    )
    //console.log(postResponse)
  } catch (error) {
    throw error
  }
}

module.exports = { sendDM }

const { sendDM } = require('../modules/slack')
const { readPurchaseRequest } = require('../modules/database')

const config = require('../config')
const axios = require('axios')

module.exports = (app) => {
  app.post('/action', async (req, res) => {
    const interactiveMessage = JSON.parse(req.body.payload)
    const databaseKey = interactiveMessage.actions[0].action_id.substring(2)
    const requestApproved = interactiveMessage.actions[0].value == 'approved'
    const originalTextMessage = interactiveMessage.message.blocks[0].text.text

    const responseBlocks = []
    responseBlocks.push(interactiveMessage.message.blocks[0])
    responseBlocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: requestApproved
          ? 'You approved this purchase request'
          : 'You denied this purchase request.',
      },
    })

    const postResponse = await axios.post(
      `${interactiveMessage.response_url}`,
      { blocks: responseBlocks },
    )

    // read purchase request from database
    const purchaseRequest = await readPurchaseRequest(databaseKey)
    console.log(purchaseRequest)

    //const matches = originalTextMessage.match(/@(.*)>.+\*(.+)\*/)

    const feedBackBlock = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Your purchase request for ${purchaseRequest.item} was ${
            requestApproved ? 'approved' : 'denied'
          }`,
        },
      },
    ]

    sendDM(purchaseRequest.userId, feedBackBlock)

    res.status(200).send()
  })
}

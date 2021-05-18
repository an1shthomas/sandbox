const { sendDM } = require('../modules/slack')
const { savePurchaseRequest } = require('../modules/database')
const config = require('../config')

module.exports = (app) => {
  app.post('/purchase', async (req, res) => {
    //console.log(req.body)
    const { text, user_id } = req.body

    res.json({
      text: `Thanks for your purchase request of *${text}*. We will message the CEO for authorization.`,
    })

    // save purchase request to firebase
    const dbKey = savePurchaseRequest(user_id, text)
    const approvedDbKey = `A_${dbKey}`
    const declineDbKey = `D_${dbKey}`

    // send a message to CEO to approve
    const blocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Hey! <@${user_id}> would like to order *${text}*. Do you authorize this purchase request?`,
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Yes',
              emoji: true,
            },
            value: 'approved',
            action_id: approvedDbKey,
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'No',
              emoji: true,
            },
            value: 'declined',
            action_id: declineDbKey,
          },
        ],
      },
    ]

    sendDM(config.ceoId, blocks)
  })
}

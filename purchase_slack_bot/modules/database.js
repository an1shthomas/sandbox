const admin = require('firebase-admin')
const config = require('../config')

const serviceAccount = require(`../keys/${config.firebasePrivateKey}`)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    'https://slack-purchase-request-ca1c7-default-rtdb.firebaseio.com',
})

var db = admin.database()

const savePurchaseRequest = (userId, item) => {
  const ref = db.ref('/')
  const response = ref.push({
    userId,
    item,
  })
  return response.key
}

const readPurchaseRequest = async (key) => {
  const ref = db.ref('/')
  const snapshot = await ref.child(key).once('value')
  return snapshot.val()
}

module.exports = {
  savePurchaseRequest,
  readPurchaseRequest
}

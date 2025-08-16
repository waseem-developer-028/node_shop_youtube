const { Router } = require('express')
const {addSubscriberValidation} = require('../../../validator/subscriber')
const {addSubscriberData} = require('../../../controllers/subscriber/subscriber.controller')
const router = Router()

router.post('/',addSubscriberValidation,addSubscriberData)

module.exports = router;

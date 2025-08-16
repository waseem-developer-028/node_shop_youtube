const { Router } = require('express')

const { notifications, unreadCount} = require('../../../controllers/notification/notification.controller')
const router = Router()

router.get('/notifications', notifications)
router.get('/unreadcount', unreadCount)


module.exports = router;

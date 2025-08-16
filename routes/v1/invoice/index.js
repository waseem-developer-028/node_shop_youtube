const { Router } = require('express')

const {index} = require('../../../controllers/invoice/invoice.controller')
const router = Router()

router.get('/orderinvoice', index)


module.exports = router;
